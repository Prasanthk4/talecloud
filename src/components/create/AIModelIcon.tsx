
import React from 'react';
import { CircleCheck, CloudCog, Laptop, Sparkles, Brain, Bot } from 'lucide-react';

interface AIModelIconProps {
  provider: string;
  size?: number;
}

export const AIModelIcon: React.FC<AIModelIconProps> = ({ provider, size = 24 }) => {
  const getIcon = () => {
    switch (provider) {
      case 'OpenAI':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Sparkles size={size-8} className="text-green-600" />
          </div>
        );
      case 'Anthropic':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <CircleCheck size={size-8} className="text-purple-600" />
          </div>
        );
      case 'Google':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Brain size={size-8} className="text-blue-600" />
          </div>
        );
      case 'Deepseek':
      case 'Mistral AI':
        return (
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <Bot size={size-8} className="text-amber-600" />
          </div>
        );
      case 'Ollama (Local)':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Laptop size={size-8} className="text-gray-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <CloudCog size={size-8} className="text-gray-600" />
          </div>
        );
    }
  };

  return getIcon();
};
