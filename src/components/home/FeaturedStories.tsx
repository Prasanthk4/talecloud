
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoryProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  id: string;
}

const StoryCard: React.FC<StoryProps> = ({ title, excerpt, imageUrl, id }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-display font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>
        <Link 
          to={`/story/${id}`}
          className="flex items-center text-tale-primary hover:text-tale-secondary transition-colors"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Read story</span>
        </Link>
      </CardContent>
    </Card>
  );
};

const FeaturedStories: React.FC = () => {
  // Mock data - these would typically come from an API
  const stories = [
    {
      id: '1',
      title: 'The Crystal Caverns',
      excerpt: 'Deep beneath the mountain, Elara discovered a hidden world of luminous crystals and ancient magic that would change her destiny forever.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80',
    },
    {
      id: '2',
      title: 'Whispers of the Stars',
      excerpt: 'When the night sky began speaking to young astronomer Theo, he embarked on an interstellar journey beyond imagination.',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
    {
      id: '3',
      title: 'The Last Guardian',
      excerpt: 'In a world where magic was fading, one guardian stood between humanity and the encroaching darkness of forgotten gods.',
      imageUrl: 'https://images.unsplash.com/photo-1515166306582-9677cd204acb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900">Featured Stories</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Explore these magical tales created with TaleCloud's AI story generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              excerpt={story.excerpt}
              imageUrl={story.imageUrl}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/library"
            className="text-tale-primary hover:text-tale-secondary font-medium underline underline-offset-4"
          >
            View all stories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
