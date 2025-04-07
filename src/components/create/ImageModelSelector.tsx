
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Wand2, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const ImageModelSelector: React.FC<ImageModelSelectorProps> = ({ 
  selectedModel, 
  onSelectModel 
}) => {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [testingApiKey, setTestingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  const imageProviders = [
    { 
      id: 'stability-ai', 
      name: 'Stability AI', 
      requiresKey: true, 
      keyName: 'stability_api_key', 
      apiUrl: 'https://platform.stability.ai/account/keys',
      // Updated to match Stability AI key format, more lenient
      keyFormat: /^sk-[A-Za-z0-9]{24,}$/
    },
    { 
      id: 'local-diffusion', 
      name: 'Local Diffusion (Ollama)', 
      requiresKey: false 
    }
  ];

  // Find provider details for the selected model
  const getProviderDetails = (modelId: string) => {
    return imageProviders.find(provider => provider.id === modelId);
  };

  // Check if an API key exists for the initially selected provider
  useEffect(() => {
    const providerDetails = getProviderDetails(selectedModel);
    if (providerDetails?.requiresKey) {
      const savedKey = localStorage.getItem(providerDetails.keyName);
      if (!savedKey) {
        setCurrentProvider(selectedModel);
        setShowApiKeyDialog(true);
      }
    }
  }, []);

  const validateApiKey = (key: string, provider: string): boolean => {
    const providerDetails = getProviderDetails(provider);
    if (!providerDetails) return false;
    
    if (!key.trim()) {
      setApiKeyError("API key cannot be empty");
      return false;
    }
    
    // Skip format validation for now - just check if key exists
    // This allows for more flexibility with API key formats
    setApiKeyError(null);
    return true;
  };

  const testApiKey = async (key: string, provider: string): Promise<boolean> => {
    const providerDetails = getProviderDetails(provider);
    if (!providerDetails) return false;
    
    setTestingApiKey(true);
    
    try {
      if (provider === 'replicate-sd') {
        const response = await fetch("https://api.replicate.com/v1/models", {
          headers: {
            "Authorization": `Token ${key.trim()}`
          }
        });
        
        if (response.ok) {
          toast.success("Replicate API key is valid");
          return true;
        } else {
          const data = await response.json();
          setApiKeyError(`API key validation failed: ${data.detail || 'Invalid key'}`);
          return false;
        }
      }
      
      // For other providers, just accept the key without testing
      // since testing may require additional setup
      return true;
    } catch (error) {
      console.error("API key validation error:", error);
      setApiKeyError("Failed to validate API key. Check your internet connection.");
      return false;
    } finally {
      setTestingApiKey(false);
    }
  };

  const handleModelSelect = (modelId: string) => {
    const providerDetails = getProviderDetails(modelId);
    
    if (providerDetails?.requiresKey) {
      const savedKey = localStorage.getItem(providerDetails.keyName);
      
      if (!savedKey) {
        setCurrentProvider(modelId);
        setShowApiKeyDialog(true);
        return;
      }
    }
    
    onSelectModel(modelId);
  };

  const handleSaveApiKey = async () => {
    const providerDetails = getProviderDetails(currentProvider);
    
    if (!providerDetails?.keyName) return;
    
    if (!validateApiKey(apiKey, currentProvider)) {
      return;
    }
    
    const isValid = await testApiKey(apiKey, currentProvider);
    
    if (!isValid) {
      return;
    }
    
    localStorage.setItem(providerDetails.keyName, apiKey.trim());
    toast.success(`${providerDetails.name} API key saved`);
    setShowApiKeyDialog(false);
    setApiKey('');
    onSelectModel(currentProvider);
  };

  const getProviderIcon = (providerId: string) => {
    return <ImageIcon className="h-4 w-4 mr-2" />;
  };
  
  // Display for API Keys
  const getApiKeyStatus = (providerId: string) => {
    const provider = getProviderDetails(providerId);
    if (!provider?.requiresKey) return "No key required";
    
    const key = provider.keyName ? localStorage.getItem(provider.keyName) : null;
    return key ? "API key set ✓" : "API key required";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="flex-grow">
          <label htmlFor="image-model" className="block text-sm font-medium text-gray-700 mb-1">
            Image Generation Model
          </label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 p-1 h-8 w-8"
          onClick={() => {
            const provider = getProviderDetails(selectedModel);
            if (provider?.requiresKey) {
              setCurrentProvider(selectedModel);
              setShowApiKeyDialog(true);
            }
          }}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>

      <Select value={selectedModel} onValueChange={handleModelSelect}>
        <SelectTrigger className="input-tale">
          <SelectValue placeholder="Select an image model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {imageProviders.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {getProviderIcon(provider.id)}
                    {provider.name}
                  </div>
                  <span className={`text-xs ml-2 ${provider.requiresKey && !localStorage.getItem(provider.keyName) ? 'text-red-500' : 'text-green-500'}`}>
                    {getApiKeyStatus(provider.id)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enter API Key</DialogTitle>
            <DialogDescription>
              {currentProvider && getProviderDetails(currentProvider)?.name} requires an API key for image generation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setApiKeyError(null);
                }}
                className={`col-span-3 ${apiKeyError ? 'border-red-500' : ''}`}
                placeholder="Enter your API key"
              />
            </div>
            
            {apiKeyError && (
              <div className="col-span-4 text-red-500 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {apiKeyError}
              </div>
            )}
            
            {currentProvider && getProviderDetails(currentProvider)?.apiUrl && (
              <div className="text-sm text-gray-500 mt-2">
                <a 
                  href={getProviderDetails(currentProvider)?.apiUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-tale-primary hover:underline"
                >
                  Get your API key here
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowApiKeyDialog(false);
              onSelectModel('local-diffusion'); // Default to local option that doesn't need API key
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveApiKey} 
              disabled={testingApiKey}
            >
              {testingApiKey ? 'Validating...' : 'Save & Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="mt-2 text-sm text-gray-500">
        Select the AI model that will generate images for your story. For best results, use Replicate with a valid API key.
      </p>
    </div>
  );
};

export default ImageModelSelector;
