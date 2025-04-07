
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-tale-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="relative">
              <div className="absolute inset-0 bg-tale-accent rounded-full blur-sm animate-pulse-glow"></div>
              <Sparkles className="h-6 w-6 text-tale-accent relative" />
            </div>
            <span className="text-xl font-display font-bold text-white">TaleCloud</span>
          </Link>
          
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TaleCloud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
