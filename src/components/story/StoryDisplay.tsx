import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Save, Share2, Heart, Loader2, RefreshCw, ImageIcon, AlertCircle, Settings, ExternalLink, SkipForward } from 'lucide-react';
import { useStory } from '@/context/StoryContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateAudio, generateImage } from '@/services/OllamaService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StoryDisplayProps {
  title: string;
  content: string[];
  images: string[];
  audioUrl?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, content, images, audioUrl: initialAudioUrl }) => {
  // UI States
  const [isFavorited, setIsFavorited] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [currentImageProvider, setCurrentImageProvider] = useState("");
  
  // Audio States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({});
  const [audioError, setAudioError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState("adam");
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const { currentStory, savedStories, saveStory } = useStory();
  const navigate = useNavigate();

  const storyObj = currentStory?.id === id 
    ? currentStory 
    : savedStories.find(s => s.id === id);

  // Removed auto-regeneration of images on component mount
  // This prevents the continuous regeneration loop

  // Initialize component with story data
  useEffect(() => {
    // If the story already has a voice preference, use it
    if (storyObj?.voice) {
      setSelectedVoice(storyObj.voice);
    }
    
    // If the story already has audio URLs stored, use them
    if (storyObj?.audioUrls && Object.keys(storyObj.audioUrls).length > 0) {
      setAudioUrls(storyObj.audioUrls);
    }
    
    // Clean up when component unmounts
    return () => {
      stopAudio();
    };
  }, []);
  
  // Audio cleanup function
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeEventListener('timeupdate', updateProgress);
      audioRef.current.removeEventListener('ended', handleAudioEnded);
      audioRef.current.removeEventListener('error', handleAudioError);
      audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const regenerateMissingImages = async () => {
    if (!storyObj) return;
    
    const imageCount = Math.ceil(content.length / 3);
    const updatedImages = [...storyObj.images];
    
    for (let i = 0; i < imageCount; i++) {
      if (!updatedImages[i] || updatedImages[i].includes('unsplash.com') || !isValidImageUrl(updatedImages[i])) {
        setIsGeneratingImage(prev => ({ ...prev, [i]: true }));
        try {
          let imagePrompt = storyObj.prompt || "";
          const imageModel = storyObj.imageModel || 'replicate-sd';
          
          const providerKeyMap: Record<string, string> = {
            'replicate-sd': 'replicate_api_key',
            'openai-dalle': 'openai_api_key',
            'stability-ai': 'stability_api_key',
          };
          
          const keyName = providerKeyMap[imageModel];
          const apiKey = keyName ? localStorage.getItem(keyName) : null;
          
          if (!apiKey && imageModel !== 'local-diffusion') {
            console.warn(`No API key found for ${imageModel}. Skipping image generation.`);
            setImageErrors(prev => ({ ...prev, [i]: true }));
            continue;
          }
          
          if (content.length > 0) {
            const relatedParagraphIndex = Math.min(i * 3, content.length - 1);
            
            if (relatedParagraphIndex < content.length) {
              imagePrompt = content[relatedParagraphIndex].substring(0, 200);
            }
          }
          
          console.log(`Regenerating image ${i} with model:`, imageModel, "prompt:", imagePrompt);
          
          const newImage = await generateImage(imagePrompt, storyObj.genre, imageModel);
          
          if (newImage && !newImage.includes('unsplash.com')) {
            console.log(`New image ${i} generated:`, newImage);
            updatedImages[i] = newImage;
          } else {
            setImageErrors(prev => ({ ...prev, [i]: true }));
          }
        } catch (error) {
          console.error(`Error regenerating image ${i}:`, error);
          setImageErrors(prev => ({ ...prev, [i]: true }));
        } finally {
          setIsGeneratingImage(prev => ({ ...prev, [i]: false }));
        }
      }
    }
    
    if (storyObj.images.join(',') !== updatedImages.join(',')) {
      saveStory({
        ...storyObj,
        images: updatedImages
      });
    }
  };

  const handleCanPlayThrough = () => {
    console.log("Audio is ready to play through");
  };

  const handleAudioError = (e: Event) => {
    console.error("Audio error:", e);
    setAudioError("There was an error playing the audio. Please try again.");
    setIsPlaying(false);
    setIsPaused(false);
    
    // Try to regenerate audio for this paragraph
    if (content[currentParagraph]) {
      toast.error("Audio playback failed. Regenerating...");
      generateAudioForParagraph(currentParagraph, false);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleAudioEnded = () => {
    console.log("Audio ended for paragraph", currentParagraph);
    setIsPlaying(false);
    setIsPaused(false);
    setAudioProgress(0);
    
    // Check if there's another paragraph to play
    if (currentParagraph < content.length - 1) {
      // Move to next paragraph
      const nextParagraph = currentParagraph + 1;
      setCurrentParagraph(nextParagraph);
      
      // Play the next paragraph if it exists
      playParagraph(nextParagraph);
    } else {
      // We've reached the end of the content
      toast.success("Finished playing the story");
    }
  };

  // Generate audio for a specific paragraph
  const generateAudioForParagraph = async (paragraphIndex: number, autoPlay = false) => {
    if (isGeneratingAudio) return;
    
    try {
      // Stop any currently playing audio
      stopAudio();
      
      setIsGeneratingAudio(true);
      setAudioError(null);
      toast.info(`Generating audio for paragraph ${paragraphIndex + 1}...`);
      
      const newAudioUrl = await generateAudio(content[paragraphIndex], selectedVoice);
      
      if (newAudioUrl) {
        // Store the audio URL for this paragraph
        const updatedAudioUrls = { ...audioUrls, [paragraphIndex]: newAudioUrl };
        setAudioUrls(updatedAudioUrls);
        
        // Update the story object with the new audio URLs
        if (storyObj) {
          const updatedStory = {
            ...storyObj,
            audioUrls: updatedAudioUrls,
            voice: selectedVoice
          };
          saveStory(updatedStory);
          toast.success(`Audio for paragraph ${paragraphIndex + 1} ready!`);
        }
        
        // Play the audio if requested
        if (autoPlay) {
          playAudio(newAudioUrl, paragraphIndex);
        }
      } else {
        setAudioError("Failed to generate audio narration.");
        toast.error("Failed to generate audio narration.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setAudioError(errorMessage);
      toast.error(`Error generating audio: ${errorMessage}`);
      console.error("Error generating audio:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
  // Play audio for a specific paragraph
  const playParagraph = (paragraphIndex: number) => {
    // Check if we already have audio for this paragraph
    if (audioUrls[paragraphIndex]) {
      playAudio(audioUrls[paragraphIndex], paragraphIndex);
    } else {
      // Generate audio for this paragraph and play it
      generateAudioForParagraph(paragraphIndex, true);
    }
  };
  
  // Play a specific audio URL
  const playAudio = (url: string, paragraphIndex: number) => {
    // Clean up any existing audio
    stopAudio();
    
    try {
      console.log("Creating new audio element for URL:", url);
      // Create a new audio element
      const audio = new Audio(url);
      audioRef.current = audio;
      
      // Set up event listeners
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioError);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      
      // Set volume - make sure it's applied
      const currentVolume = isMuted ? 0 : volume;
      console.log("Setting initial volume to", currentVolume);
      audio.volume = currentVolume;
      
      // Set current paragraph
      setCurrentParagraph(paragraphIndex);
      
      // Play the audio
      console.log("Attempting to play audio");
      audio.play().then(() => {
        console.log("Audio playback started successfully");
        setIsPlaying(true);
        setIsPaused(false);
        console.log(`Playing audio for paragraph ${paragraphIndex + 1}`);
      }).catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Could not play audio. Regenerating...");
        generateAudioForParagraph(paragraphIndex, true);
      });
    } catch (error) {
      console.error("Error in playAudio:", error);
      toast.error("Audio playback error. Regenerating...");
      generateAudioForParagraph(paragraphIndex, true);
    }
  };

  // Toggle play/pause for the current paragraph
  const togglePlay = () => {
    // If we're generating audio, don't do anything
    if (isGeneratingAudio) return;
    
    // If we're already playing, pause the audio
    if (isPlaying && audioRef.current) {
      console.log("Pausing audio");
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }
    
    // If we're paused, resume playback
    if (isPaused && audioRef.current) {
      console.log("Resuming audio");
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsPaused(false);
      }).catch(error => {
        console.error("Error resuming audio:", error);
        toast.error("Could not resume audio. Regenerating...");
        generateAudioForParagraph(currentParagraph, true);
      });
      return;
    }
    
    // Otherwise, start playing the current paragraph
    console.log("Starting playback of paragraph", currentParagraph);
    playParagraph(currentParagraph);
  };
  
  // Skip to the next paragraph
  const skipToNextParagraph = () => {
    if (currentParagraph < content.length - 1) {
      const nextParagraph = currentParagraph + 1;
      setCurrentParagraph(nextParagraph);
      playParagraph(nextParagraph);
    } else {
      toast.info("You've reached the end of the story");
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    console.log("Volume changed to:", volumeValue);
    
    // Always update the volume state
    setVolume(volumeValue);
    
    // Update mute state based on volume
    if (volumeValue === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    
    // Update audio volume if we have an audio element
    if (audioRef.current) {
      console.log("Setting audio volume to", volumeValue);
      audioRef.current.volume = volumeValue;
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (storyObj) {
      saveStory(storyObj);
    }
  };

  const handleSave = () => {
    if (storyObj) {
      saveStory(storyObj);
      toast.success('Story saved successfully!');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: 'Check out this amazing AI-generated story!',
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleChangeVoice = (voice: string) => {
    // Stop any currently playing audio
    stopAudio();
    
    setSelectedVoice(voice);
    // Clear all audio URLs to force regeneration with the new voice
    setAudioUrls({});
    
    // Update the story object with the new voice preference
    if (storyObj) {
      const updatedStory = {
        ...storyObj,
        voice: voice,
        audioUrls: {}
      };
      saveStory(updatedStory);
    }
    
    toast.info(`Voice changed to ${voice}. Click play to hear it.`);
  };

  const voices = [
    { id: "adam", name: "Adam (Male)" },
    { id: "antoni", name: "Antoni (Male)" },
    { id: "elli", name: "Elli (Female)" },
    { id: "bella", name: "Bella (Female)" },
    { id: "josh", name: "Josh (Male)" },
  ];

  const handleRegenerateImage = async (index: number) => {
    if (!storyObj || isGeneratingImage[index]) return;
    
    // Start with the model from the story, or default to local-diffusion
    let imageModel = storyObj.imageModel || 'local-diffusion';
    
    const providerKeyMap: Record<string, string> = {
      'replicate-sd': 'replicate_api_key',
      'openai-dalle': 'openai_api_key',
      'stability-ai': 'stability_api_key',
    };
    
    const keyName = providerKeyMap[imageModel];
    const apiKey = keyName ? localStorage.getItem(keyName) : null;
    
    // If the model requires an API key but we don't have one, fall back to local-diffusion
    if (!apiKey && imageModel !== 'local-diffusion') {
      console.log(`No API key found for ${imageModel}, falling back to local-diffusion`);
      imageModel = 'local-diffusion';
    }
    
    setIsGeneratingImage(prev => ({ ...prev, [index]: true }));
    setImageErrors(prev => ({ ...prev, [index]: false }));
    
    try {
      toast.info(`Regenerating image ${index + 1}...`);
      
      let imagePrompt = storyObj.prompt || "";
      
      if (content.length > 0) {
        const relatedParagraphIndex = Math.min(index * 3, content.length - 1);
        
        if (relatedParagraphIndex < content.length) {
          imagePrompt = content[relatedParagraphIndex].substring(0, 200);
        }
      }
      
      console.log("Regenerating image with model:", imageModel, "prompt:", imagePrompt);
      
      const newImage = await generateImage(imagePrompt, storyObj.genre, imageModel);
      
      if (newImage && newImage.startsWith('http') && !newImage.includes('unsplash.com')) {
        console.log("New image generated:", newImage);
        const updatedImages = [...storyObj.images];
        updatedImages[index] = newImage;
        
        const updatedStory = {
          ...storyObj,
          images: updatedImages,
          imageModel: imageModel // Save the model used for generation
        };
        
        saveStory(updatedStory);
        
        toast.success("Image regenerated successfully!");
      } else {
        setImageErrors(prev => ({ ...prev, [index]: true }));
        toast.error("Failed to generate a new image. Please check your API key or try again later.");
      }
    } catch (error) {
      console.error("Error regenerating image:", error);
      setImageErrors(prev => ({ ...prev, [index]: true }));
      toast.error("Failed to regenerate image. Please try again.");
    } finally {
      setIsGeneratingImage(prev => ({ ...prev, [index]: false }));
    }
  };

  const isValidImageUrl = (url: string): boolean => {
    return !!url && url.trim() !== "" && url.startsWith("http");
  };

  const handleSaveApiKey = () => {
    if (!currentImageProvider || !apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    const providerKeyMap: Record<string, string> = {
      'replicate-sd': 'replicate_api_key',
      'openai-dalle': 'openai_api_key',
      'stability-ai': 'stability_api_key',
    };
    
    const keyName = providerKeyMap[currentImageProvider];
    
    if (keyName) {
      localStorage.setItem(keyName, apiKey.trim());
      toast.success(`API key saved successfully`);
      setShowApiKeyDialog(false);
      setApiKey("");
      
      window.location.reload();
    }
  };

  const getImageComponent = (imageIndex: number) => {
    const imageUrl = images && images[imageIndex] ? images[imageIndex] : null;
    const isPlaceholder = !imageUrl || !isValidImageUrl(imageUrl);
    
    return (
      <div className="my-8 relative">
        {isGeneratingImage[imageIndex] ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-tale-primary" />
              <p className="text-gray-600">Generating image...</p>
            </div>
          </div>
        ) : imageErrors[imageIndex] ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 mx-auto mb-2 text-red-500" />
              <p className="text-gray-600 mb-2">Failed to generate image</p>
              <Button 
                size="sm" 
                onClick={() => handleRegenerateImage(imageIndex)}
                className="bg-tale-primary hover:bg-tale-primary-dark text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={imageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"} 
              alt={`Illustration for ${title}`} 
              className="w-full rounded-lg shadow-md"
            />
            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-white bg-opacity-70 hover:bg-white p-1 h-8 w-8"
                onClick={() => handleRegenerateImage(imageIndex)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-white bg-opacity-70 hover:bg-white p-1 h-8 w-8"
                onClick={() => {
                  if (storyObj) {
                    setCurrentImageProvider(storyObj.imageModel || 'replicate-sd');
                    setShowApiKeyDialog(true);
                  }
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1 text-center italic">
          {isPlaceholder ? "Placeholder image. Click Regenerate to create a custom image." : "AI-generated image based on story content."}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{title}</h1>
        
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <label htmlFor="voice-select" className="text-sm text-gray-600">Voice:</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => handleChangeVoice(e.target.value)}
              className="text-sm border rounded px-2 py-1"
              disabled={isGeneratingAudio || isPlaying}
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 p-1 h-8 w-8"
              onClick={() => handleGenerateAudio(currentParagraph, false)}
              disabled={isGeneratingAudio || isPlaying}
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <Button 
            onClick={togglePlay} 
            variant="outline" 
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center cursor-pointer"
            disabled={isGeneratingAudio} // Only disable during generation, otherwise always clickable
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isGeneratingAudio ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            onClick={skipToNextParagraph}
            variant="outline"
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center cursor-pointer"
            disabled={isGeneratingAudio || currentParagraph >= content.length - 1}
            type="button"
            aria-label="Skip to next paragraph"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <div className="bg-gray-200 h-2 flex-1 max-w-md rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${audioError ? 'bg-red-400' : 'bg-tale-primary'}`}
              style={{ width: `${audioError ? 100 : audioProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-full w-8 h-8 p-0"
              onClick={toggleMute}
              disabled={Object.keys(audioUrls).length === 0 || !!audioError}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
              disabled={Object.keys(audioUrls).length === 0 || !!audioError}
            />
          </div>
        </div>
        
        {audioError && (
          <div className="text-red-500 mb-4 text-sm">
            {audioError}
            <Button 
              variant="link" 
              className="text-sm text-red-600 underline ml-2"
              onClick={() => handleGenerateAudio()}
            >
              Try Again
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFavorite}>
            <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} /> 
            {isFavorited ? 'Favorited' : 'Favorite'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>
      
      <div className="paper-bg p-6 md:p-10 rounded-xl shadow-md">
        <div className="story-text prose max-w-none">
          {content.map((paragraph, index) => (
            <React.Fragment key={index}>
              {index > 0 && index % 3 === 0 && Math.floor(index / 3) - 1 < images.length && (
                getImageComponent(Math.floor(index / 3) - 1)
              )}
              <p className={`${currentParagraph === index && isPlaying ? 'bg-tale-light bg-opacity-50 p-2 -m-2 rounded transition-all' : ''}`}>
                {paragraph}
              </p>
            </React.Fragment>
          ))}
          
          {content.length > 3 && Math.floor(content.length / 3) < images.length && (
            getImageComponent(Math.floor(content.length / 3))
          )}
        </div>
      </div>
      
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update API Key</DialogTitle>
            <DialogDescription>
              {currentImageProvider === 'replicate-sd' && "Enter your Replicate API key to generate images"}
              {currentImageProvider === 'openai-dalle' && "Enter your OpenAI API key to generate images"}
              {currentImageProvider === 'stability-ai' && "Enter your Stability AI API key to generate images"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                placeholder="Enter your API key"
              />
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              {currentImageProvider === 'replicate-sd' && (
                <a 
                  href="https://replicate.com/account/api-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-tale-primary hover:underline"
                >
                  Get your Replicate API key here
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              {currentImageProvider === 'openai-dalle' && (
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-tale-primary hover:underline"
                >
                  Get your OpenAI API key here
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              {currentImageProvider === 'stability-ai' && (
                <a 
                  href="https://platform.stability.ai/account/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-tale-primary hover:underline"
                >
                  Get your Stability AI API key here
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowApiKeyDialog(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>Save & Reload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryDisplay;
