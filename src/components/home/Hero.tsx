
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, ImageIcon, Sparkles, Mic } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-tale-light to-white py-20 md:py-32">
      {/* Background decoration elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-tale-secondary opacity-10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-tale-accent opacity-10 rounded-full blur-3xl animate-float"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-tale-primary rounded-full blur-md animate-pulse-glow"></div>
              <Sparkles className="h-10 w-10 text-tale-primary relative" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-tale-primary via-tale-secondary to-tale-accent bg-clip-text text-transparent">
            Create Magical Stories with AI
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Transform your ideas into captivating tales with AI-generated text, beautiful illustrations, and immersive audio narration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-tale-primary hover:bg-tale-secondary text-white px-8 py-6 text-lg"
            >
              <Link to="/create">
                <BookOpen className="mr-2 h-5 w-5" /> Start Creating
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-tale-primary text-tale-primary hover:bg-tale-light px-8 py-6 text-lg"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="rounded-full bg-tale-light w-14 h-14 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-tale-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Story Generation</h3>
            <p className="text-gray-600">Create compelling stories with the power of AI. Just provide a prompt and watch your tale come to life.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="rounded-full bg-tale-light w-14 h-14 flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-tale-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Beautiful Illustrations</h3>
            <p className="text-gray-600">Enhance your stories with AI-generated artwork that brings your characters and scenes to vivid life.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="rounded-full bg-tale-light w-14 h-14 flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-tale-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Voice Narration</h3>
            <p className="text-gray-600">Listen to your stories with immersive AI narration, bringing another dimension to your creative work.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
