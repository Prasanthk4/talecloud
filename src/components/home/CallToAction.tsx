
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-tale-primary to-purple-800 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-tale-accent opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-tale-accent mr-2" />
            <span className="text-tale-accent font-medium">Unleash your creativity</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Start Creating Your Magical Stories Today
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of storytellers using TaleCloud to craft engaging narratives with AI-powered text, illustrations, and audio narration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-tale-primary hover:bg-gray-100 px-8 py-6 text-lg"
            >
              <Link to="/create">
                Create Your First Story
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg font-medium bg-purple-700/50"
            >
              <Link to="/library">
                Explore Stories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
