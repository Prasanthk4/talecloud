interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_k?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface ElevenLabsResponse {
  audioUrl: string;
}

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:11434';
const USE_CLOUD_API = true; // Force cloud API mode since we have keys

// API Keys from localStorage (environment variables are only used if explicitly set)
const getApiKey = (keyName: string, envName: string): string | null => {
  // Only use environment variable if it's explicitly set and not empty
  const envValue = import.meta.env[envName];
  if (envValue && typeof envValue === 'string' && envValue.trim() !== '') {
    return envValue;
  }
  
  // Otherwise use localStorage (default behavior)
  return localStorage.getItem(keyName);
};

export const generateStory = async (
  prompt: string,
  genre: string,
  length: string,
  model: string = 'ollama-mistral'
): Promise<string> => {
  try {
    const lengthMap: Record<string, number> = {
      short: 500,
      medium: 1000,
      long: 1500,
    };

    const maxTokens = lengthMap[length] || 1000;
    
    const systemPrompt = `You are a creative fiction writer specializing in ${genre} stories. 
    Write an engaging story based on the following prompt. 
    Make it approximately ${length} in length with vivid descriptions and compelling characters.
    Format the story in paragraphs separated by blank lines.
    Begin writing the story immediately without any introductions or meta-commentary.
    IMPORTANT: Make sure the story is unique and specific to the prompt. DO NOT reuse story structure or elements.`;
    
    const fullPrompt = `${systemPrompt}\n\nPROMPT: ${prompt}`;

    console.log("Generating story with model:", model);
    console.log("Prompt:", fullPrompt.substring(0, 100) + "...");
    console.log("Using Cloud API mode");

    try {
      if (model.startsWith('ollama-')) {
        // Use local Ollama
        const ollamaModel = model.replace('ollama-', '');
        return await generateStoryFromLocalOllama(fullPrompt, maxTokens, ollamaModel);
      } else if (model.startsWith('openai-')) {
        // Use OpenAI
        try {
          return await generateStoryFromOpenAI(fullPrompt, maxTokens, model);
        } catch (openaiError) {
          // Check for quota exceeded error
          if ((openaiError as Error).message?.includes("exceeded your current quota")) {
            console.log("OpenAI quota exceeded, trying fallback to Gemini");
            // Try Gemini as fallback
            if (getApiKey('gemini_api_key', 'VITE_GEMINI_API_KEY')) {
              return await generateStoryFromGemini(fullPrompt, maxTokens, "gemini-1.5-pro");
            }
            throw new Error("OpenAI quota exceeded. Please update your billing or try another model like Gemini.");
          }
          throw openaiError;
        }
      // Claude models have been removed
      } else if (model.startsWith('deepseek-')) {
        // Use Deepseek
        try {
          return await generateStoryFromDeepseek(fullPrompt, maxTokens, model);
        } catch (deepseekError) {
          // Check for invalid API key
          if ((deepseekError as Error).message?.includes("invalid") && (deepseekError as Error).message?.includes("api key")) {
            console.log("Deepseek API key invalid, trying fallback to Gemini");
            // Try Gemini as fallback
            if (getApiKey('gemini_api_key', 'VITE_GEMINI_API_KEY')) {
              return await generateStoryFromGemini(fullPrompt, maxTokens, "gemini-1.5-pro");
            }
            throw new Error("Your Deepseek API key is invalid. Please update it in settings or try another model.");
          }
          throw deepseekError;
        }
      } else if (model.startsWith('gemini-')) {
        // Use Gemini
        return await generateStoryFromGemini(fullPrompt, maxTokens, model);
      } else if (model.startsWith('mistral-')) {
        // Use Mistral AI
        return await generateStoryFromMistral(fullPrompt, maxTokens, model);
      } else {
        // Try to find a working model
        console.log("No specific model matched, trying available models");
        if (getApiKey('gemini_api_key', 'VITE_GEMINI_API_KEY')) {
          return await generateStoryFromGemini(fullPrompt, maxTokens, "gemini-1.5-pro");
        } else if (getApiKey('openai_api_key', 'VITE_OPENAI_API_KEY')) {
          return await generateStoryFromOpenAI(fullPrompt, maxTokens, "openai-gpt-3.5");
        } else if (getApiKey('mistral_api_key', 'VITE_MISTRAL_API_KEY')) {
          return await generateStoryFromMistral(fullPrompt, maxTokens, "mistral-large-latest");
        } else {
          throw new Error("No valid API keys found. Please add at least one API key in settings.");
        }
      }
    } catch (error) {
      // Check if the error is related to missing API key
      if ((error as Error).message?.includes("API key is required")) {
        throw new Error(`${(error as Error).message} Please add the required API key in settings.`);
      }
      // Re-throw the error to be caught by the outer try-catch
      throw error;
    }
  } catch (error) {
    console.error("Error generating story:", error);
    // Return a more user-friendly error message
    if ((error as Error).message?.includes("Failed to fetch")) {
      throw new Error("Could not connect to AI service. Please check your connection or try another AI model.");
    } else if ((error as Error).message?.includes("API key is required")) {
      // Pass through API key errors directly
      throw error;
    } else if ((error as Error).message?.includes("exceeded your current quota")) {
      throw new Error("You've exceeded your OpenAI quota. Please update your billing details or try another model like Gemini.");
    } else if ((error as Error).message?.includes("invalid") && (error as Error).message?.includes("api key")) {
      throw new Error("Your API key appears to be invalid. Please check and update it in settings.");
    }
    throw new Error(`Story generation failed: ${(error as Error).message || "Unknown error"}`);
  }
};

// Function to generate story from local Ollama
const generateStoryFromLocalOllama = async (prompt: string, maxTokens: number, ollamaModel: string = "mistral"): Promise<string> => {
  const request: OllamaRequest = {
    model: ollamaModel, // or llama3, gemma or any model you have in Ollama
    prompt: prompt,
    options: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: maxTokens
    }
  };

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    console.error("Ollama API error:", response.status, response.statusText);
    throw new Error(`Error: ${response.status} ${response.statusText}. Make sure Ollama is running and the model is installed.`);
  }

  const data: OllamaResponse = await response.json();
  console.log("Story generated successfully from local Ollama");
  return data.response;
};

// Function to generate story from OpenAI
const generateStoryFromOpenAI = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    throw new Error("OpenAI API key is required. Please add it in settings.");
  }
  
  let model = "gpt-3.5-turbo";
  if (modelId === "openai-gpt-4o") {
    model = "gpt-4o";
  }
  
  try {
    console.log("Calling OpenAI API with model:", model);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error details:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from OpenAI API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI story generation:", error);
    throw new Error(`OpenAI story generation failed: ${(error as Error).message}`);
  }
};

// Claude/Anthropic models have been removed

// Function to generate story from Deepseek
const generateStoryFromDeepseek = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = getApiKey('deepseek_api_key', 'VITE_DEEPSEEK_API_KEY');
  
  if (!apiKey) {
    throw new Error("Deepseek API key is required. Please add it in settings.");
  }
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Deepseek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Deepseek API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with Deepseek story generation:", error);
    throw new Error(`Deepseek story generation failed: ${(error as Error).message}`);
  }
};

// Function to generate story from Gemini
const generateStoryFromGemini = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = getApiKey('gemini_api_key', 'VITE_GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please add it in settings.");
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Gemini API");
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error with Gemini story generation:", error);
    throw new Error(`Gemini story generation failed: ${(error as Error).message}`);
  }
};

// Function to generate story from Mistral AI
const generateStoryFromMistral = async (prompt: string, maxTokens: number, modelId: string): Promise<string> => {
  const apiKey = getApiKey('mistral_api_key', 'VITE_MISTRAL_API_KEY');
  
  if (!apiKey) {
    throw new Error("Mistral API key is required. Please add it in settings.");
  }
  
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("Story generated successfully from Mistral API");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error with Mistral story generation:", error);
    throw new Error(`Mistral story generation failed: ${(error as Error).message}`);
  }
};

const generateFallbackStory = (prompt: string): string => {
  console.warn("Using fallback story generation");
  
  // Extract potential characters or themes from the prompt
  const words = prompt.split(' ');
  const characters = words.filter(word => word.length > 5).slice(0, 2);
  const character = characters.length > 0 ? characters[0] : "protagonist";
  
  return `Once upon a time, there was a ${character} who embarked on an extraordinary journey.
  
  The world was full of wonder and mystery, and our hero was determined to explore it all.
  
  Through forests deep and mountains high, across rushing rivers and vast plains, the adventure continued.
  
  Along the way, friendships were formed, challenges were overcome, and valuable lessons were learned.
  
  And though the path wasn't always clear, the journey itself proved to be the greatest treasure of all.
  
  In the end, returning home with stories to tell and wisdom to share, our hero found that the greatest adventures often lead us back to ourselves, forever changed by the paths we've walked.`;
};

export const generateImage = async (prompt: string, genre: string, imageModel: string = 'replicate-sd'): Promise<string> => {
  try {
    console.log("Image generation requested for prompt:", prompt);
    console.log("Using image model:", imageModel);
    
    // Handle different image generation services based on the selected model
    if (imageModel === 'replicate-sd') {
      return await generateImageWithReplicate(prompt, genre);
    } else if (imageModel === 'openai-dalle') {
      return await generateImageWithOpenAI(prompt, genre);
    } else if (imageModel === 'stability-ai') {
      return await generateImageWithStabilityAI(prompt, genre);
    } else if (imageModel === 'local-diffusion') {
      return await generateImageWithLocalDiffusion(prompt, genre);
    } else {
      // Default to Replicate if the model is not recognized
      console.warn("Unknown image model, defaulting to Replicate Stable Diffusion");
      return await generateImageWithReplicate(prompt, genre);
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return getPlaceholderImage(genre);
  }
}

// Generate image with Replicate API (Stable Diffusion)
const generateImageWithReplicate = async (prompt: string, genre: string): Promise<string> => {
  try {
    // Get API key from localStorage
    const apiKey = getApiKey('replicate_api_key', 'VITE_REPLICATE_API_KEY');
    
    if (!apiKey) {
      console.warn("No Replicate API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // Create a more detailed and specific prompt based on the story prompt and genre
    const styleMap: Record<string, string> = {
      fantasy: "fantasy art style, magical, mystical, detailed fantasy environment",
      "sci-fi": "science fiction style, futuristic, high-tech, cinematic lighting",
      mystery: "dark atmospheric style, moody lighting, noir aesthetic, mysterious",
      romance: "romantic style, soft lighting, warm colors, emotional scene",
      horror: "horror style, dark, eerie, unsettling, atmospheric horror scene",
      adventure: "adventure style, dynamic, epic landscape, dramatic lighting",
      historical: "historical style, period accurate details, vintage aesthetic",
      "fairy-tale": "fairy tale style, enchanted, whimsical, storybook illustration"
    };
    
    const stylePrompt = styleMap[genre] || styleMap.fantasy;
    const enhancedPrompt = `${stylePrompt}, ${prompt.substring(0, 200)}`;
    
    console.log("Using placeholder image instead of Replicate API due to CORS limitations");
    console.log("Prompt that would be used:", enhancedPrompt);
    
    // Due to CORS limitations in browser environment, we'll use a placeholder image
    // In a production environment, you would need to:
    // 1. Set up a proxy server to handle API calls
    // 2. Or use a serverless function
    // 3. Or implement a backend service
    
    // For now, we'll use a placeholder image based on the genre
    return getPlaceholderImage(genre);
  } catch (error) {
    console.error("Error with image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with OpenAI DALL-E
const generateImageWithOpenAI = async (prompt: string, genre: string): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      console.warn("No OpenAI API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // Create a more detailed prompt based on genre
    const styleMap: Record<string, string> = {
      fantasy: "fantasy style with magical elements",
      "sci-fi": "futuristic sci-fi scene",
      mystery: "mysterious noir scene",
      romance: "romantic scene with soft lighting",
      horror: "unsettling horror scene",
      adventure: "epic adventure scene",
      historical: "detailed historical scene",
      "fairy-tale": "whimsical fairy tale illustration"
    };
    
    const stylePrompt = styleMap[genre] || '';
    const enhancedPrompt = `${prompt}. ${stylePrompt}`;
    
    console.log("Calling DALL-E API with prompt:", enhancedPrompt);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.data[0].url;
    
  } catch (error) {
    console.error("Error with OpenAI image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with Stability AI
const generateImageWithStabilityAI = async (prompt: string, genre: string): Promise<string> => {
  try {
    const apiKey = getApiKey('stability_api_key', 'VITE_STABILITY_API_KEY');
    
    if (!apiKey) {
      console.warn("No Stability AI API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // Create enhanced prompt similar to other providers
    const styleMap: Record<string, string> = {
      fantasy: "fantasy art style, magical, mystical",
      "sci-fi": "science fiction style, futuristic, high-tech",
      mystery: "dark atmospheric style, moody lighting, noir aesthetic",
      romance: "romantic style, soft lighting, warm colors",
      horror: "horror style, dark, eerie, unsettling",
      adventure: "adventure style, dynamic, epic landscape",
      historical: "historical style, period accurate details",
      "fairy-tale": "fairy tale style, enchanted, whimsical"
    };
    
    const stylePrompt = styleMap[genre] || '';
    const enhancedPrompt = `${prompt}. ${stylePrompt}`;
    
    console.log("Calling Stability AI API with prompt:", enhancedPrompt);
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: enhancedPrompt,
            weight: 1
          },
          {
            text: "blurry, bad anatomy, extra limbs, deformed, disfigured, text, watermark, signature, low quality",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stability AI API error: ${errorText}`);
    }
    
    const responseJSON = await response.json();
    
    // Base64 decode and create URL
    const base64Image = responseJSON.artifacts[0].base64;
    const blob = await fetch(`data:image/png;base64,${base64Image}`).then(res => res.blob());
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error("Error with Stability AI image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with Midjourney API (placeholder, since Midjourney doesn't have a direct API)
const generateImageWithMidjourney = async (prompt: string, genre: string): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('midjourney_api_key');
    
    if (!apiKey) {
      console.warn("No Midjourney API key found. Using placeholder image instead.");
      return getPlaceholderImage(genre);
    }
    
    // This is a placeholder. In a real implementation, you would 
    // use a third-party service that provides access to Midjourney
    console.log("Midjourney API not directly available. Using placeholder.");
    
    // For now, just return a placeholder image
    return getPlaceholderImage(genre);
    
  } catch (error) {
    console.error("Error with Midjourney image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Generate image with local Ollama (using a Diffusion model)
const generateImageWithLocalDiffusion = async (prompt: string, genre: string): Promise<string> => {
  try {
    // Using local Ollama for diffusion models
    console.log("Using local Ollama for image generation:", prompt);
    
    // Create a stylized prompt similar to other services
    const styleMap: Record<string, string> = {
      fantasy: "fantasy art style, magical, mystical",
      "sci-fi": "science fiction style, futuristic, high-tech",
      mystery: "dark atmospheric style, moody lighting, noir aesthetic",
      romance: "romantic style, soft lighting, warm colors",
      horror: "horror style, dark, eerie, unsettling",
      adventure: "adventure style, dynamic, epic landscape",
      historical: "historical style, period accurate details",
      "fairy-tale": "fairy tale style, enchanted, whimsical"
    };
    
    const stylePrompt = styleMap[genre] || '';
    const enhancedPrompt = `${prompt}. ${stylePrompt}`;
    
    // Call to Ollama running locally with a diffusion model
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sdxl", // Assuming the SDXL model is installed in Ollama
        prompt: enhancedPrompt,
        stream: false,
        format: "png"
      }),
    });
    
    if (!response.ok) {
      console.error("Ollama diffusion API error:", response.status);
      throw new Error("Failed to generate image with local Ollama. Make sure the SDXL model is installed.");
    }
    
    // Response should be binary image data
    const blob = await response.blob();
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error("Error with local diffusion image generation:", error);
    return getPlaceholderImage(genre);
  }
};

// Helper function to poll for Replicate results
const pollForResult = async (resultUrl: string, apiKey: string): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 30; // Timeout after 30 attempts (about 60 seconds)
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for result...`);
      const response = await fetch(resultUrl, {
        headers: {
          "Authorization": `Token ${apiKey}`,
        },
      });
      
      if (!response.ok) {
        console.error(`Poll response not OK: ${response.status}`, response.statusText);
        throw new Error(`Poll error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Poll attempt", attempts, "status:", data.status);
      
      if (data.status === "succeeded") {
        // Return the first generated image
        console.log("Image generation succeeded, output:", data.output);
        return data.output[0];
      } else if (data.status === "failed") {
        console.error("Image generation failed, error:", data.error);
        throw new Error(`Image generation failed: ${data.error || "Unknown error"}`);
      }
      
      // Wait before trying again (increasing delay to avoid rate limits)
      const delay = Math.min(2000 + attempts * 500, 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    } catch (error) {
      console.error("Error polling for image result:", error);
      return "";
    }
  }
  
  console.warn("Image generation timed out");
  return "";
}

// Fallback to placeholder images based on genre
const getPlaceholderImage = (genre: string): string => {
  const genreImageMap: Record<string, string> = {
    fantasy: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80",
    "sci-fi": "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    mystery: "https://images.unsplash.com/photo-1580982327559-c1202864eb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    romance: "https://images.unsplash.com/photo-1515166306582-9677cd204acb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    horror: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    adventure: "https://images.unsplash.com/photo-1566936737687-8f392a237b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    historical: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    "fairy-tale": "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  };
  
  return genreImageMap[genre] || genreImageMap.fantasy;
}

export const generateAudio = async (text: string, voice: string = "onyx"): Promise<string> => {
  try {
    console.log("Audio generation requested for text of length:", text.length);
    
    // Check if we should use local TTS instead of ElevenLabs
    const useLocalTTS = localStorage.getItem('use_local_tts') === 'true';
    
    // Get ElevenLabs API key from localStorage
    const apiKey = getApiKey('elevenlabs_api_key', 'VITE_ELEVENLABS_API_KEY');
    
    if (useLocalTTS || !apiKey) {
      console.log("Using local TTS fallback instead of ElevenLabs");
      return generateLocalAudio(text, voice);
    }
    
    // Truncate text if it's too long (ElevenLabs has character limits)
    const truncatedText = text.length > 5000 ? text.substring(0, 5000) : text;
    
    const voiceId = getVoiceId(voice);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    console.log("Calling ElevenLabs API with voice:", voice, "voiceId:", voiceId);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: truncatedText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });
    
    if (!response.ok) {
      console.error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      // Fall back to local audio generation if ElevenLabs fails
      return generateLocalAudio(text, voice);
    }
    
    // The response is the audio file itself
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);
    // Try local fallback as a last resort
    try {
      return generateLocalAudio(text, voice);
    } catch (fallbackError) {
      throw new Error(`Audio generation failed: ${(error as Error).message || "Unknown error"}`);
    }
  }
};

// Local audio generation fallback using the Web Speech API
const generateLocalAudio = async (text: string, voice: string = "default"): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Using Web Speech API for local TTS");
      
      // Create an audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Set up audio recording
      const chunks: Blob[] = [];
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        resolve(audioUrl);
      };
      
      // Use the browser's speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to match voice by name or language
        const preferredVoice = voices.find(v => 
          v.name.toLowerCase().includes(voice.toLowerCase()) || 
          (voice === 'adam' && v.name.toLowerCase().includes('male')) ||
          (voice === 'bella' && v.name.toLowerCase().includes('female'))
        ) || voices[0];
        
        utterance.voice = preferredVoice;
      }
      
      // Start recording
      mediaRecorder.start();
      
      // Play a short tone to start the recording
      oscillator.connect(gainNode);
      gainNode.connect(mediaStreamDestination);
      oscillator.frequency.value = 0; // Silent tone
      gainNode.gain.value = 0.01; // Very quiet
      oscillator.start();
      
      // Handle speech events
      utterance.onend = () => {
        // Stop recording after speech ends
        setTimeout(() => {
          oscillator.stop();
          mediaRecorder.stop();
          audioContext.close();
        }, 500); // Small delay to capture the full speech
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        oscillator.stop();
        mediaRecorder.stop();
        audioContext.close();
        reject(new Error("Speech synthesis failed"));
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error("Local audio generation error:", error);
      reject(error);
    }
  });
};

// Helper function to map voice names to ElevenLabs voice IDs
const getVoiceId = (voice: string): string => {
  const voiceMap: Record<string, string> = {
    adam: "pNInz6obpgDQGcFmaJgB", // Adam
    antoni: "ErXwobaYiN019PkySvjV", // Antoni
    bella: "EXAVITQu4vr4xnSDxMaL", // Bella
    elli: "MF3mGyEYCl7XYWbV9V6O", // Elli
    josh: "TxGEqnHWrfWFTfGW9XjX", // Josh
    rachel: "21m00Tcm4TlvDq8ikWAM", // Rachel
    sam: "yoZ06aMxZJJ28mfd3POQ", // Sam
    domi: "AZnzlk1XvdvUeBnXmlld", // Domi
    onyx: "IKne3meq5aSn9XLyUdCD", // Onyx
    default: "IKne3meq5aSn9XLyUdCD" // Default to Onyx
  };
  
  return voiceMap[voice] || voiceMap.default;
};
