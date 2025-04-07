
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Cloud, Laptop } from 'lucide-react';
import ApiKeySettings from '@/components/settings/ApiKeySettings';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Navbar: React.FC = () => {
  const [useCloudApi, setUseCloudApi] = useState(false);
  
  // Load cloud API setting from localStorage
  useEffect(() => {
    const cloudApiSetting = localStorage.getItem('use_cloud_api');
    if (cloudApiSetting) {
      setUseCloudApi(cloudApiSetting === 'true');
    }
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-sm py-4 fixed w-full z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-tale-primary rounded-full blur-sm animate-pulse-glow"></div>
            <Sparkles className="h-6 w-6 text-tale-primary relative" />
          </div>
          <span className="text-xl font-display font-bold text-tale-primary">TaleCloud</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-tale-primary transition-colors">
            Home
          </Link>
          <Link to="/create" className="text-gray-700 hover:text-tale-primary transition-colors">
            Create
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-tale-primary transition-colors">
            About
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {useCloudApi ? (
                    <>
                      <Cloud className="h-3 w-3 text-blue-500" />
                      <span className="hidden sm:inline text-gray-600">Cloud API</span>
                    </>
                  ) : (
                    <>
                      <Laptop className="h-3 w-3 text-gray-500" />
                      <span className="hidden sm:inline text-gray-600">Local API</span>
                    </>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {useCloudApi 
                    ? "Using cloud services for AI. Requires API keys." 
                    : "Using local Ollama for AI generation. Must be installed and running."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="relative">
            <ApiKeySettings />
            <div className="tooltip-text absolute right-0 -bottom-10 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
              Configure API Keys
            </div>
          </div>
          
          <Button asChild className="bg-tale-primary hover:bg-tale-secondary">
            <Link to="/create">
              <BookOpen className="h-4 w-4 mr-2" /> Create Story
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
