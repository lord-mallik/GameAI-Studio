export interface AIProvider {
  name: string;
  type: 'text' | 'image' | 'voice';
  endpoint: string;
  apiKey: string;
  model?: string;
}

export interface NovitaImageRequest {
  prompt: string;
  style: 'realistic' | 'anime' | 'fantasy' | 'scifi' | 'pixel';
  dimensions: '512x512' | '768x768' | '1024x1024';
  count: number;
}

export interface GeminiRequest {
  prompt: string;
  context?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIAsset {
  id: string;
  type: 'character' | 'environment' | 'item' | 'ui' | 'animation';
  prompt: string;
  url: string;
  thumbnail: string;
  metadata: {
    style: string;
    dimensions: string;
    generated: Date;
    provider: string;
  };
}

export interface GameAssistantRequest {
  type: 'story' | 'balance' | 'code' | 'bug' | 'optimization';
  context: string;
  request: string;
}

export interface GameAssistantResponse {
  type: string;
  content: string;
  suggestions?: string[];
  code?: string;
  confidence: number;
}