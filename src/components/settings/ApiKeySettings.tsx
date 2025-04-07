import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { AIModel } from '@/components/create/AIModelSelector';

// Define AI models with their API key information
const aiModels: AIModel[] = [
  {
    id: 'openai-gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Advanced model with strong reasoning capabilities',
    requiresApiKey: true,
    apiKeyName: 'openai_api_key'
  },
  {
    id: 'openai-gpt-3.5',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient for general purpose tasks',
    requiresApiKey: true,
    apiKeyName: 'openai_api_key'
  },
  {
    id: 'deepseek-chat',
    name: 'Deepseek Chat',
    provider: 'Deepseek',
    description: 'General purpose chat model',
    requiresApiKey: true,
    apiKeyName: 'deepseek_api_key'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Google\'s advanced multimodal AI model',
    requiresApiKey: true,
    apiKeyName: 'gemini_api_key'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Powerful open-weight model',
    requiresApiKey: true,
    apiKeyName: 'mistral_api_key'
  }
];

// Define image models
const imageModels = [
  {
    id: 'stability-ai',
    name: 'Stability AI',
    provider: 'Stability AI',
    description: 'High quality image generation',
    requiresApiKey: true,
    apiKeyName: 'stability_api_key'
  },
  {
    id: 'local-diffusion',
    name: 'Local Diffusion',
    provider: 'Ollama',
    description: 'Local image generation using Ollama',
    requiresApiKey: false,
    apiKeyName: ''
  }
];

// Define audio models
const audioModels = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    description: 'High quality voice synthesis',
    requiresApiKey: true,
    apiKeyName: 'elevenlabs_api_key'
  },
  {
    id: 'browser-tts',
    name: 'Browser TTS',
    provider: 'Browser',
    description: 'Built-in browser text-to-speech',
    requiresApiKey: false,
    apiKeyName: ''
  }
];

// Get unique API key names from all models
const getUniqueApiKeyModels = () => {
  const allModels = [...aiModels, ...imageModels, ...audioModels];
  const uniqueApiKeyMap = new Map();
  
  allModels.forEach(model => {
    if (model.requiresApiKey && model.apiKeyName) {
      if (!uniqueApiKeyMap.has(model.apiKeyName)) {
        uniqueApiKeyMap.set(model.apiKeyName, model);
      }
    }
  });
  
  return Array.from(uniqueApiKeyMap.values());
};

interface ApiKeyStatus {
  isValid: boolean;
  isChecking: boolean;
  message?: string;
}

const ApiKeySettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const [useCloudApi, setUseCloudApi] = useState(false);
  const [useLocalTTS, setUseLocalTTS] = useState(false);
  const [ollamaEndpoint, setOllamaEndpoint] = useState('');
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [apiKeyStatus, setApiKeyStatus] = useState<Record<string, ApiKeyStatus>>({});

  useEffect(() => {
    // Load Ollama endpoint from localStorage
    const ollama = localStorage.getItem('ollama_endpoint') || 'http://localhost:11434';
    setOllamaEndpoint(ollama);
    
    // Load settings from localStorage
    const cloudApiSetting = localStorage.getItem('use_cloud_api');
    const localTTSSetting = localStorage.getItem('use_local_tts');
    
    if (cloudApiSetting) {
      setUseCloudApi(cloudApiSetting === 'true');
    }
    
    if (localTTSSetting) {
      setUseLocalTTS(localTTSSetting === 'true');
    }
    
    // Load all API keys from localStorage
    const uniqueModels = getUniqueApiKeyModels();
    const newApiKeys: Record<string, string> = {};
    
    uniqueModels.forEach(model => {
      const apiKey = localStorage.getItem(model.apiKeyName);
      if (apiKey) {
        newApiKeys[model.apiKeyName] = '•'.repeat(16); // Mask the API key
      } else {
        newApiKeys[model.apiKeyName] = '';
      }
    });
    
    setApiKeys(newApiKeys);
  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('use_cloud_api', useCloudApi.toString());
    localStorage.setItem('use_local_tts', useLocalTTS.toString());
    
    // Save Ollama endpoint
    if (ollamaEndpoint) {
      localStorage.setItem('ollama_endpoint', ollamaEndpoint);
    }
    
    // Save all API keys if they were changed (not placeholders)
    Object.entries(apiKeys).forEach(([apiKeyName, value]) => {
      if (value && !value.includes('•')) {
        localStorage.setItem(apiKeyName, value);
      }
    });
    
    toast.success('Settings saved successfully!');
    setOpen(false);
  };

  const toggleShowApiKey = (key: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset validation status when key changes
    setApiKeyStatus(prev => ({
      ...prev,
      [key]: { isValid: false, isChecking: false }
    }));
  };

  const validateApiKey = async (keyName: string, value: string) => {
    if (!value) return;
    
    // Set to checking state
    setApiKeyStatus(prev => ({
      ...prev,
      [keyName]: { isValid: false, isChecking: true }
    }));
    
    try {
      let isValid = false;
      let message = "";
      
      // Different validation logic based on the API provider
      if (keyName === 'openai_api_key') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${value}`
          }
        });
        isValid = response.ok;
        if (!isValid) {
          const data = await response.json();
          message = data.error?.message || "Invalid API key";
        }
      } else if (keyName === 'gemini_api_key') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${value}`);
        isValid = response.ok;
        if (!isValid) {
          const data = await response.json();
          message = data.error?.message || "Invalid API key";
        }
      } else if (keyName === 'claude_api_key') {
        const response = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': value,
            'anthropic-version': '2023-06-01'
          }
        });
        isValid = response.ok;
        if (!isValid) {
          const data = await response.json();
          message = data.error?.message || "Invalid API key";
        }
      } else if (keyName === 'mistral_api_key') {
        const response = await fetch('https://api.mistral.ai/v1/models', {
          headers: {
            'Authorization': `Bearer ${value}`
          }
        });
        isValid = response.ok;
        if (!isValid) {
          const data = await response.json();
          message = data.error?.message || "Invalid API key";
        }
      } else if (keyName === 'deepseek_api_key') {
        const response = await fetch('https://api.deepseek.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${value}`
          }
        });
        isValid = response.ok;
        if (!isValid) {
          const data = await response.json();
          message = data.error?.message || "Invalid API key";
        }
      } else {
        // For other APIs, just assume it's valid for now
        isValid = true;
      }
      
      setApiKeyStatus(prev => ({
        ...prev,
        [keyName]: { isValid, isChecking: false, message }
      }));
      
      if (isValid) {
        toast.success(`${keyName.replace('_api_key', '').toUpperCase()} API key is valid`);
      } else {
        toast.error(`${keyName.replace('_api_key', '').toUpperCase()} API key is invalid: ${message}`);
      }
    } catch (error) {
      console.error(`Error validating ${keyName}:`, error);
      setApiKeyStatus(prev => ({
        ...prev,
        [keyName]: { 
          isValid: false, 
          isChecking: false, 
          message: (error as Error).message || "Validation failed"
        }
      }));
      toast.error(`Could not validate ${keyName.replace('_api_key', '').toUpperCase()} API key`);
    }
  };

  const renderApiKeyInput = (label: string, keyName: string, description?: string) => {
    const status = apiKeyStatus[keyName];
    
    const renderStatusIcon = () => {
      if (!apiKeys[keyName]) return null;
      if (status?.isChecking) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      if (status?.isValid) return <CheckCircle className="h-4 w-4 text-green-500" />;
      if (status?.isValid === false) return <XCircle className="h-4 w-4 text-red-500" />;
      return null;
    };
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor={keyName} className="text-sm font-medium">
            {label}
          </Label>
          <div className="flex items-center gap-2">
            {renderStatusIcon()}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toggleShowApiKey(keyName)}
              className="h-8 px-2"
            >
              {showApiKeys[keyName] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
        <div className="flex gap-2">
          <Input
            id={keyName}
            type={showApiKeys[keyName] ? "text" : "password"}
            placeholder={`Enter your ${label}`}
            value={apiKeys[keyName] || ""}
            onChange={(e) => handleApiKeyChange(keyName, e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => validateApiKey(keyName, apiKeys[keyName] || "")}
            disabled={!apiKeys[keyName] || status?.isChecking}
            className="whitespace-nowrap"
          >
            {status?.isChecking ? "Checking..." : "Validate Key"}
          </Button>
        </div>
        {status?.message && !status.isValid && !status.isChecking && (
          <p className="text-xs text-red-500 mt-1">{status.message}</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="api" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-4 mt-4 max-h-[50vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-mode" className="text-sm font-medium">API Mode</Label>
                <RadioGroup id="api-mode" value={useCloudApi ? 'cloud' : 'local'} onValueChange={(value) => setUseCloudApi(value === 'cloud')} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cloud" id="cloud" />
                    <Label htmlFor="cloud">Use Cloud APIs (requires API keys)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local">Use Local Models (requires Ollama)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="local-tts" 
                  checked={useLocalTTS} 
                  onCheckedChange={setUseLocalTTS} 
                />
                <Label htmlFor="local-tts">Use browser's built-in Text-to-Speech (no API key required)</Label>
              </div>
              
              <div className="pt-4">
                <Label htmlFor="ollama" className="text-sm font-medium">Ollama Endpoint</Label>
                <Input
                  id="ollama"
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for local AI models when Cloud APIs are disabled
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4 mt-4 max-h-[50vh] overflow-y-auto pr-2">
            <div className="space-y-6">
              {/* Compact list of all API keys */}
              {getUniqueApiKeyModels().map(model => {
                const apiKeyName = model.apiKeyName;
                const provider = model.provider;
                let description = '';
                
                // Determine the description based on the model type
                if (apiKeyName === 'stability_api_key') {
                  description = 'Used for image generation';
                } else if (apiKeyName === 'elevenlabs_api_key') {
                  description = 'Used for voice narration (optional)';
                } else {
                  description = 'Used for text generation';
                }
                
                return (
                  <div key={apiKeyName}>
                    {renderApiKeyInput(provider, apiKeyName, description)}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySettings;
