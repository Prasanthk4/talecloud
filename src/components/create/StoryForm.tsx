import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenLine, Wand2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStory } from '@/context/StoryContext';
import AIModelSelector from './AIModelSelector';
import ImageModelSelector from './ImageModelSelector';

const StoryForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [length, setLength] = useState('medium');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiModel, setAiModel] = useState('ollama-mistral');
  const [imageModel, setImageModel] = useState('replicate-sd');
  
  const { generateNewStory, isGenerating } = useStory();

  useEffect(() => {
    // Update with a new valid ElevenLabs API key
    if (!localStorage.getItem('elevenlabs_api_key') || localStorage.getItem('elevenlabs_api_key') === 'sk_c91ce9c1e81ef5695bb7dd85ba2d51509f8beec837ca59a2') {
      // Using a local fallback approach instead of hardcoded key
      localStorage.setItem('use_local_tts', 'true');
      console.log("Using local TTS fallback instead of ElevenLabs");
    }
    
    if (!localStorage.getItem('stability_api_key')) {
      localStorage.setItem('stability_api_key', 'sk-XxUQH9uaYKMVK1QrfOYMQQNYVXRJQxGcjWQDyFzjmDXfMFWp');
      console.log("Stability AI API key has been set");
    }
    
    localStorage.setItem('use_cloud_api', 'true');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a story prompt");
      return;
    }
    
    console.log("Submitting story generation with:", {
      title,
      prompt,
      genre, 
      length,
      model: aiModel,
      imageModel: imageModel
    });
    
    try {
      await generateNewStory(title, prompt, genre, length, aiModel, imageModel);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  const handleInsertPrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className="magical-border p-6 md:p-8 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        <AIModelSelector selectedModel={aiModel} onSelectModel={setAiModel} />
        
        <ImageModelSelector selectedModel={imageModel} onSelectModel={setImageModel} />
        
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Story Title (Optional)
          </label>
          <Input
            id="title"
            placeholder="Enter a title or leave blank for AI to generate one"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-tale"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Story Prompt *
          </label>
          <Textarea
            id="prompt"
            placeholder="Describe your story idea, characters, setting, or any details you want to include..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="textarea-tale min-h-[150px]"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Be as detailed or as vague as you want. Our AI will fill in the gaps!
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Story Options</span>
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-tale-primary hover:text-tale-secondary text-sm font-medium"
            >
              {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="input-tale">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="sci-fi">Science Fiction</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="historical">Historical</SelectItem>
                    <SelectItem value="fairy-tale">Fairy Tale</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Story Length
              </label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className="input-tale">
                  <SelectValue placeholder="Select a length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="short">Short (5 minutes)</SelectItem>
                    <SelectItem value="medium">Medium (10 minutes)</SelectItem>
                    <SelectItem value="long">Long (15+ minutes)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {showAdvancedOptions && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                  Writing Style
                </label>
                <Select defaultValue="descriptive">
                  <SelectTrigger className="input-tale">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="poetic">Poetic</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="suspenseful">Suspenseful</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                  Audience Age
                </label>
                <Select defaultValue="all-ages">
                  <SelectTrigger className="input-tale">
                    <SelectValue placeholder="Select an audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="young-adult">Young Adult</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="all-ages">All Ages</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="narration" className="block text-sm font-medium text-gray-700 mb-1">
                Narration Voice
              </label>
              <Select defaultValue="narrator1">
                <SelectTrigger className="input-tale">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="narrator1">Storyteller (Male)</SelectItem>
                    <SelectItem value="narrator2">Storyteller (Female)</SelectItem>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                    <SelectItem value="soothing">Soothing</SelectItem>
                    <SelectItem value="mystical">Mystical</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button type="button" variant="outline" className="btn-tale-secondary">
            <PenLine className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button type="submit" className="btn-tale" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Story
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoryForm;
