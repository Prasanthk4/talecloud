# TaleCloud Creator

TaleCloud is an AI-powered storytelling platform that helps you create engaging narratives with illustrations and audio narration.

## Features

- **AI Story Generation**: Create compelling stories with the power of AI using various models (OpenAI, Mistral, Gemini, etc.)
- **Beautiful Illustrations**: Enhance your stories with AI-generated artwork
- **Voice Narration**: Listen to your stories with immersive AI narration
- **Story Library**: Save and organize your creations
- **Multiple AI Models**: Choose from various AI models for different creative styles

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/talecloud-creator.git

# Navigate to the project directory
cd talecloud-creator

# Install dependencies
npm install

# Start the development server
npm run dev
```

### API Keys

To use all features of TaleCloud, you'll need to set up API keys for the following services:

- OpenAI API (for GPT models)
- ElevenLabs (for voice synthesis)
- Stability AI (for image generation)
- Mistral AI (optional)
- Google Gemini (optional)

You can add these API keys in the Settings panel of the application.

## Technology Stack

This project is built with modern web technologies:

- **Vite**: Fast development server and optimized builds
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **React Router**: Client-side routing

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html          # HTML entry point
└── package.json        # Project dependencies
```

## Deployment

This project can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the contents of the `dist` folder to your hosting provider

Recommended hosting options:
- Vercel
- Netlify
- GitHub Pages

## License

MIT
