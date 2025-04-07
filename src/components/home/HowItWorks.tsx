
import React from 'react';
import { PencilLine, ImageIcon, Mic, Sparkles } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900">How TaleCloud Works</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Creating beautiful, multi-modal stories is easy with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative p-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-tale-primary text-white flex items-center justify-center font-bold text-lg z-10">
              1
            </div>
            <div className="h-full pt-8 pb-4 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center">
              <PencilLine className="w-10 h-10 text-tale-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enter Your Prompt</h3>
              <p className="text-gray-600">
                Describe the story you want to create or choose from our template library to get started.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-tale-primary text-white flex items-center justify-center font-bold text-lg z-10">
              2
            </div>
            <div className="h-full pt-8 pb-4 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Sparkles className="w-10 h-10 text-tale-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Writes Your Story</h3>
              <p className="text-gray-600">
                Our AI generates a compelling narrative based on your prompt, complete with characters and plot.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-tale-primary text-white flex items-center justify-center font-bold text-lg z-10">
              3
            </div>
            <div className="h-full pt-8 pb-4 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center">
              <ImageIcon className="w-10 h-10 text-tale-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Add Illustrations</h3>
              <p className="text-gray-600">
                Beautiful AI-generated images are created to complement key moments in your story.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative p-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-tale-primary text-white flex items-center justify-center font-bold text-lg z-10">
              4
            </div>
            <div className="h-full pt-8 pb-4 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Mic className="w-10 h-10 text-tale-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Listen to Narration</h3>
              <p className="text-gray-600">
                Bring your story to life with AI-generated voice narration for an immersive experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
