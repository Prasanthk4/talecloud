
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import StoryDisplay from '@/components/story/StoryDisplay';
import { Button } from '@/components/ui/button';
import { useStory } from '@/context/StoryContext';
import { ChevronLeft, BookOpen, ImageIcon, Cpu } from 'lucide-react';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories } = useStory();
  
  // Find the story by id, first checking currentStory, then savedStories
  const story = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  if (!story) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <p className="text-xl text-gray-700 mb-6">Story not found</p>
          <Link to="/library">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Get related stories from the same genre (up to 3)
  const relatedStories = savedStories
    .filter(s => s.genre === story.genre && s.id !== story.id)
    .slice(0, 3);

  // Make sure we have at least the first image
  const storyImages = story.images && story.images.length > 0 ? 
    story.images.filter(img => img && img.trim() !== "") : 
    ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23"];

  console.log("Story images:", storyImages);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link to="/library">
            <Button variant="ghost" className="pl-0 text-tale-primary">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>
        </div>
        
        <div className="mb-6 text-sm text-gray-500 flex flex-wrap gap-4">
          <div className="flex items-center">
            <Cpu className="h-4 w-4 mr-1" />
            <span>Story Model: {story.model || "Default"}</span>
          </div>
          
          <div className="flex items-center">
            <ImageIcon className="h-4 w-4 mr-1" />
            <span>Image Model: {story.imageModel || "Default"}</span>
          </div>
        </div>
        
        <StoryDisplay 
          title={story.title} 
          content={story.content} 
          images={storyImages} 
          audioUrl={story.audioUrl}
        />
        
        {relatedStories.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-xl font-semibold mb-4">More Like This</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedStories.map(relatedStory => (
                <Link to={`/story/${relatedStory.id}`} key={relatedStory.id}>
                  <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                    <img 
                      src={relatedStory.images && relatedStory.images[0] ? relatedStory.images[0] : "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"} 
                      alt={relatedStory.title} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">{relatedStory.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Story;
