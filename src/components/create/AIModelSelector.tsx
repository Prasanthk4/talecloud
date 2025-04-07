
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AIModelIcon } from "@/components/create/AIModelIcon";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  requiresApiKey: boolean;
  apiKeyName: string;
}

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
  },
  {
    id: 'ollama-llama3',
    name: 'LLaMA 3',
    provider: 'Ollama (Local)',
    description: 'Open-source model running locally (requires Ollama)',
    requiresApiKey: false,
    apiKeyName: ''
  },
  {
    id: 'ollama-mistral',
    name: 'Mistral 7B',
    provider: 'Ollama (Local)',
    description: 'Open-source model running locally (requires Ollama)',
    requiresApiKey: false,
    apiKeyName: ''
  }
];

interface AIModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  const [activeTab, setActiveTab] = useState("cloud");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedModelData, setSelectedModelData] = useState<AIModel | null>(
    aiModels.find(model => model.id === selectedModel) || null
  );

  const handleModelSelect = (modelId: string) => {
    const model = aiModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModelData(model);
      onSelectModel(modelId);
      
      // Check if API key exists in localStorage
      if (model.requiresApiKey) {
        const savedKey = localStorage.getItem(model.apiKeyName);
        if (!savedKey) {
          setShowApiKeyInput(true);
        } else {
          setShowApiKeyInput(false);
        }
      } else {
        setShowApiKeyInput(false);
      }
    }
  };

  const saveApiKey = () => {
    if (!selectedModelData) return;
    
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    localStorage.setItem(selectedModelData.apiKeyName, apiKey.trim());
    toast.success(`${selectedModelData.provider} API key saved successfully`);
    setShowApiKeyInput(false);
    setApiKey("");
  };

  const cloudModels = aiModels.filter(model => !model.provider.includes('Local'));
  const localModels = aiModels.filter(model => model.provider.includes('Local'));

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <h3 className="text-lg font-semibold mb-4">Select AI Model</h3>
      
      <Tabs defaultValue="cloud" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="cloud">Cloud Models</TabsTrigger>
          <TabsTrigger value="local">Local Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cloud">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {cloudModels.map((model) => (
              <div
                key={model.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedModel === model.id 
                    ? 'border-tale-primary bg-tale-light' 
                    : 'border-gray-200 hover:border-tale-primary hover:bg-gray-50'
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="flex items-center gap-3">
                  <AIModelIcon provider={model.provider} />
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.provider}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{model.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="local">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {localModels.map((model) => (
              <div
                key={model.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedModel === model.id 
                    ? 'border-tale-primary bg-tale-light' 
                    : 'border-gray-200 hover:border-tale-primary hover:bg-gray-50'
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="flex items-center gap-3">
                  <AIModelIcon provider={model.provider} />
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.provider}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{model.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
            <p className="text-sm text-amber-800">
              Local models require Ollama to be installed and running on your machine.
              <a 
                href="https://ollama.ai/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-amber-900 font-medium hover:underline mt-1"
              >
                Learn more about Ollama <ExternalLink size={12} />
              </a>
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {showApiKeyInput && selectedModelData && (
        <div className="mt-4 border-t pt-4">
          <Label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Enter {selectedModelData.provider} API Key
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="apiKey"
              type="password"
              placeholder={`Your ${selectedModelData.provider} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveApiKey} type="button">Save</Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your API key will be stored securely in your browser's local storage.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIModelSelector;
