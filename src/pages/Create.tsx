
import React from 'react';
import Layout from '@/components/layout/Layout';
import StoryForm from '@/components/create/StoryForm';
import { Sparkles, BookText, ImageIcon, Mic } from 'lucide-react';

const Create: React.FC = () => {
  const examplePrompts = [
    "A young wizard discovers an ancient spell book that allows communication with animals, but each time it's used, a mysterious shadow grows larger...",
    "On their 16th birthday, a teenager receives a mysterious letter revealing they are the heir to an underwater kingdom that's been hidden for centuries."
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-tale-primary rounded-full blur-sm animate-pulse-glow"></div>
              <Sparkles className="h-8 w-8 text-tale-primary relative" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Create Your Story</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your story idea below and our AI will generate a complete story with illustrations and audio narration.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-tale-light flex items-center justify-center mb-2">
                <BookText className="h-6 w-6 text-tale-primary" />
              </div>
              <span className="text-gray-700 font-medium">AI Story</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-tale-light flex items-center justify-center mb-2">
                <ImageIcon className="h-6 w-6 text-tale-primary" />
              </div>
              <span className="text-gray-700 font-medium">AI Illustrations</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-tale-light flex items-center justify-center mb-2">
                <Mic className="h-6 w-6 text-tale-primary" />
              </div>
              <span className="text-gray-700 font-medium">AI Voice</span>
            </div>
          </div>

          <StoryForm />

          <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Need inspiration?</h3>
            <p className="text-gray-600 mb-4">Try one of these prompts:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examplePrompts.map((prompt, index) => (
                <div 
                  key={index}
                  className="bg-white p-3 rounded border border-gray-200 cursor-pointer hover:bg-tale-light transition-colors"
                  onClick={() => {
                    // This would set the prompt text in the form
                    const form = document.getElementById("prompt") as HTMLTextAreaElement;
                    if (form) {
                      form.value = prompt;
                      form.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                >
                  <p className="text-sm text-gray-800">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
