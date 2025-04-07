
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Sparkles, BookOpen, ImageIcon, Mic, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-tale-primary rounded-full blur-sm animate-pulse-glow"></div>
              <Sparkles className="h-8 w-8 text-tale-primary relative" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">About TaleCloud</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            TaleCloud is an AI-powered creative platform that turns your ideas into captivating stories with beautiful illustrations and immersive audio narration.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-display font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
            We believe everyone has stories to tell. TaleCloud combines cutting-edge AI technology with intuitive design to empower creators, educators, parents, and storytellers of all kinds to bring their ideas to life through engaging multi-modal narratives.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="rounded-full bg-tale-light w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="h-8 w-8 text-tale-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Story Generation</h3>
              <p className="text-gray-600">
                Our advanced language models create coherent, engaging stories from your prompts, with characters, dialogue, and plotlines that capture your imagination.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="rounded-full bg-tale-light w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <ImageIcon className="h-8 w-8 text-tale-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Beautiful Illustrations</h3>
              <p className="text-gray-600">
                Each story comes with custom AI-generated artwork that brings key moments to life with stunning visuals tailored to your narrative.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="rounded-full bg-tale-light w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Mic className="h-8 w-8 text-tale-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voice Narration</h3>
              <p className="text-gray-600">
                Listen to your stories with immersive AI narration, featuring natural-sounding voices that add emotion and depth to your tales.
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">Our Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Sparkles className="h-5 w-5 text-tale-primary mr-2" />
                Text Generation
              </h3>
              <p className="text-gray-700 mb-6">
                We use state-of-the-art large language models like Mistral-7B and LLaMA-3 to create compelling narratives that are coherent, creative, and tailored to your input.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Sparkles className="h-5 w-5 text-tale-primary mr-2" />
                Image Generation
              </h3>
              <p className="text-gray-700">
                Our visual AI uses Stable Diffusion to create stunning, context-aware illustrations that perfectly complement your story's key moments and themes.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Sparkles className="h-5 w-5 text-tale-primary mr-2" />
                Audio Synthesis
              </h3>
              <p className="text-gray-700 mb-6">
                Using neural text-to-speech technology like VITS and Bark, we generate natural-sounding narration that brings your stories to life with emotional depth.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Sparkles className="h-5 w-5 text-tale-primary mr-2" />
                Seamless Integration
              </h3>
              <p className="text-gray-700">
                Our platform seamlessly combines text, image, and audio generation to create a cohesive multi-modal experience that engages all the senses.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">Perfect For</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Writers & Creators</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Overcome writer's block with AI assistance</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Visualize scenes and characters</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Experiment with different narrative styles</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Parents & Children</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Create personalized bedtime stories</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Foster imagination and creativity</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Make reading more engaging with illustrations</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Educators</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Create custom teaching materials</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Engage students with multimedia stories</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Support diverse learning styles</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Content Creators</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Generate unique content for blogs and channels</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Create engaging social media posts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Produce multimedia content efficiently</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-tale-primary to-purple-800 text-white rounded-xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Gift className="h-12 w-12 mx-auto mb-4 text-tale-light" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Ready to Create Your First Story?</h2>
            <p className="text-white/90 mb-6">
              Join thousands of storytellers using TaleCloud to craft magical narratives with AI-powered text, illustrations, and audio narration.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-tale-primary hover:bg-gray-100"
            >
              <Link to="/create">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
