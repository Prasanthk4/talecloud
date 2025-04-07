
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StoryGrid from '@/components/library/StoryGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX } from 'lucide-react';

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Mock data for stories
  const allStories = [
    {
      id: '1',
      title: 'The Crystal Caverns',
      excerpt: 'Deep beneath the mountain, Elara discovered a hidden world of luminous crystals and ancient magic that would change her destiny forever.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80',
      date: 'May 12, 2023',
      hasAudio: true,
    },
    {
      id: '2',
      title: 'Whispers of the Stars',
      excerpt: 'When the night sky began speaking to young astronomer Theo, he embarked on an interstellar journey beyond imagination.',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      date: 'June 3, 2023',
      hasAudio: true,
    },
    {
      id: '3',
      title: 'The Last Guardian',
      excerpt: 'In a world where magic was fading, one guardian stood between humanity and the encroaching darkness of forgotten gods.',
      imageUrl: 'https://images.unsplash.com/photo-1515166306582-9677cd204acb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
      date: 'April 28, 2023',
      hasAudio: false,
    },
    {
      id: '4',
      title: 'Keeper of Dreams',
      excerpt: 'Maya discovered she could enter other people\'s dreams, but altering their nightmares had unexpected consequences in the waking world.',
      imageUrl: 'https://images.unsplash.com/photo-1566936737687-8f392a237b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      date: 'July 15, 2023',
      hasAudio: true,
    },
    {
      id: '5',
      title: 'City of Clockwork',
      excerpt: 'In a metropolis powered by impossible machinery, an apprentice engineer uncovered the truth behind the city\'s mechanical heart.',
      imageUrl: 'https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      date: 'May 22, 2023',
      hasAudio: false,
    },
    {
      id: '6',
      title: 'The Forgotten Forest',
      excerpt: 'When Lily followed a mysterious deer into the woods behind her grandmother\'s house, she discovered a realm frozen in time.',
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      date: 'June 30, 2023',
      hasAudio: true,
    },
  ];

  // Filter stories based on search term and genre
  const filteredStories = allStories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Story Library</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of AI-generated stories with beautiful illustrations and audio narration.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search stories by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="sci-fi">Science Fiction</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || selectedGenre !== 'all') && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center">
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Stories</TabsTrigger>
            <TabsTrigger value="recent">Recently Created</TabsTrigger>
            <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {filteredStories.length > 0 ? (
              <StoryGrid stories={filteredStories} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No stories found matching your criteria.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent">
            <StoryGrid stories={filteredStories.slice(0, 3)} />
          </TabsContent>
          <TabsContent value="favorites">
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't favorited any stories yet.</p>
              <Button variant="link" className="mt-2">
                Explore stories
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Library;
