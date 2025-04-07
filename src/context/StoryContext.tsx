import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  content: string[];
  images: string[];
  audioUrl?: string;
  createdAt: Date;
  genre: string;
  prompt: string;
  model?: string;
  imageModel?: string;
  voice?: string; // Added voice preference
}

interface StoryContextType {
  currentStory: Story | null;
  savedStories: Story[];
  generateNewStory: (title: string, prompt: string, genre: string, length: string, model?: string, imageModel?: string) => Promise<void>;
  saveStory: (story: Story) => void;
  isGenerating: boolean;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedStoriesFromStorage = localStorage.getItem('savedStories');
    if (savedStoriesFromStorage) {
      try {
        const parsedStories = JSON.parse(savedStoriesFromStorage);
        const storiesWithDates = parsedStories.map((story: any) => ({
          ...story,
          createdAt: new Date(story.createdAt)
        }));
        setSavedStories(storiesWithDates);
      } catch (error) {
        console.error('Failed to parse saved stories:', error);
        toast.error('Failed to load saved stories');
      }
    }
  }, []);

  React.useEffect(() => {
    if (savedStories.length > 0) {
      localStorage.setItem('savedStories', JSON.stringify(savedStories));
    }
  }, [savedStories]);

  const generateNewStory = async (title: string, prompt: string, genre: string, length: string, model: string = 'ollama-mistral', imageModel: string = 'replicate-sd') => {
    if (isGenerating) {
      toast.info('A story is already being generated');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast.info('Generating your story...');
      
      const { generateStory, generateImage } = await import('../services/OllamaService');
      
      console.log("Starting story generation with model:", model);
      console.log("Image generation model:", imageModel);
      console.log("Story prompt:", prompt);
      
      const content = await generateStory(prompt, genre, length, model);
      
      console.log("Story content generated, length:", content.length);
      
      const paragraphs = content
        .split('\n\n')
        .filter(p => p.trim().length > 0);
      
      console.log("Paragraphs extracted:", paragraphs.length);
      
      toast.info('Creating illustrations for your story...');
      
      const imageCount = Math.min(5, Math.max(2, Math.ceil(paragraphs.length / 3)));
      console.log("Generating", imageCount, "images");
      
      const imagePrompts = [];
      
      imagePrompts.push(prompt);
      
      if (paragraphs.length > 3) {
        const middleIndex = Math.floor(paragraphs.length / 2);
        const endIndex = paragraphs.length - 1;
        
        imagePrompts.push(paragraphs[0].substring(0, 200));
        
        if (paragraphs.length > 6) {
          imagePrompts.push(paragraphs[middleIndex].substring(0, 200));
        }
        
        imagePrompts.push(paragraphs[endIndex].substring(0, 200));
      }
      
      while (imagePrompts.length < imageCount) {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        imagePrompts.push(paragraphs[randomIndex].substring(0, 200));
      }
      
      const uniquePrompts = [...new Set(imagePrompts)].slice(0, imageCount);
      
      const imagePromises = uniquePrompts.map(imagePrompt => generateImage(imagePrompt, genre, imageModel));
      const images = await Promise.all(imagePromises);
      
      console.log("Images generated:", images.length);
      
      const storyTitle = title || `Story about ${prompt.slice(0, 20)}...`;
      
      const story: Story = {
        id: `story-${Date.now()}`,
        title: storyTitle,
        content: paragraphs,
        images: images,
        genre: genre,
        prompt: prompt,
        createdAt: new Date(),
        model: model,
        imageModel: imageModel,
        voice: 'adam'
      };
      
      console.log("Story object created:", story.id);
      
      setCurrentStory(story);
      navigate(`/story/${story.id}`);
      toast.success('Your story has been created!');
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error(`Failed to generate story: ${(error as Error).message || 'Please try again'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveStory = (story: Story) => {
    setSavedStories(prev => {
      const existingStoryIndex = prev.findIndex(s => s.id === story.id);
      if (existingStoryIndex >= 0) {
        const updatedStories = [...prev];
        updatedStories[existingStoryIndex] = story;
        return updatedStories;
      }
      return [...prev, story];
    });
    
    if (currentStory && currentStory.id === story.id) {
      setCurrentStory(story);
    }
    
    toast.success('Story saved to library!');
  };

  const value = {
    currentStory,
    savedStories,
    generateNewStory,
    saveStory,
    isGenerating
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};
