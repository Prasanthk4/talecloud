
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen } from 'lucide-react';

interface StoryCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  hasAudio: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ id, title, excerpt, imageUrl, date, hasAudio }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {hasAudio && (
          <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
            <PlayCircle className="h-5 w-5" />
          </div>
        )}
      </div>
      <CardContent className="p-5 flex-grow">
        <h3 className="text-xl font-display font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">{excerpt}</p>
        <p className="text-gray-400 text-xs">{date}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button 
          asChild 
          variant="outline" 
          className="w-full border-tale-primary text-tale-primary hover:bg-tale-light hover:text-tale-primary"
        >
          <Link to={`/story/${id}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Read Story
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface StoryGridProps {
  stories: StoryCardProps[];
}

const StoryGrid: React.FC<StoryGridProps> = ({ stories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {stories.map(story => (
        <StoryCard key={story.id} {...story} />
      ))}
    </div>
  );
};

export default StoryGrid;
