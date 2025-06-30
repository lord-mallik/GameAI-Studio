import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiRequest, GameAssistantRequest, GameAssistantResponse } from '../types/ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  setApiKey(key: string) {
    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateStory(prompt: string, context?: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const fullPrompt = `
        You are an expert game writer creating engaging text-based adventure games.
        Context: ${context || 'Creating a new adventure game'}
        
        Request: ${prompt}
        
        Please provide a detailed, immersive response that includes:
        - Rich descriptive text
        - Character development
        - Environmental details
        - Potential player choices
        
        Keep the tone engaging and appropriate for interactive fiction.
      `;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini story generation failed:', error);
      throw new Error('Failed to generate story with Gemini');
    }
  }

  async getGameAssistance(request: GameAssistantRequest): Promise<GameAssistantResponse> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = this.buildAssistancePrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return {
        type: request.type,
        content,
        suggestions: this.extractSuggestions(content),
        confidence: 0.85
      };
    } catch (error) {
      console.error('Gemini assistance failed:', error);
      throw new Error('Failed to get assistance from Gemini');
    }
  }

  private buildAssistancePrompt(request: GameAssistantRequest): string {
    const prompts = {
      story: `
        As a game narrative expert, help with this story development request:
        Context: ${request.context}
        Request: ${request.request}
        
        Provide creative suggestions for plot development, character arcs, and narrative structure.
      `,
      balance: `
        As a game balance expert, analyze this gameplay request:
        Context: ${request.context}
        Request: ${request.request}
        
        Provide recommendations for difficulty curves, progression systems, and player engagement.
      `,
      code: `
        As a senior game developer, help with this technical request:
        Context: ${request.context}
        Request: ${request.request}
        
        Provide code suggestions, best practices, and implementation guidance.
      `,
      bug: `
        As a debugging expert, help identify and fix this issue:
        Context: ${request.context}
        Request: ${request.request}
        
        Provide step-by-step debugging approach and potential solutions.
      `,
      optimization: `
        As a performance expert, help optimize this aspect:
        Context: ${request.context}
        Request: ${request.request}
        
        Provide specific optimization strategies and implementation tips.
      `
    };

    return prompts[request.type] || prompts.story;
  }

  private extractSuggestions(content: string): string[] {
    // Extract bullet points or numbered lists as suggestions
    const suggestions: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || 
          /^\d+\./.test(trimmed)) {
        suggestions.push(trimmed.replace(/^[•\-\d\.]\s*/, ''));
      }
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      const testAI = new GoogleGenerativeAI(key);
      const testModel = testAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await testModel.generateContent('Test connection');
      await result.response;
      return true;
    } catch {
      return false;
    }
  }

  async generateGameContent(type: 'scene' | 'character' | 'item', description: string): Promise<any> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    const prompts = {
      scene: `Create a detailed game scene based on: ${description}. Include title, description, and 3-4 player choices.`,
      character: `Create a game character based on: ${description}. Include name, description, attributes, and backstory.`,
      item: `Create a game item based on: ${description}. Include name, description, type, and special properties.`
    };

    try {
      const result = await this.model.generateContent(prompts[type]);
      const response = await result.response;
      return this.parseGameContent(type, response.text());
    } catch (error) {
      console.error('Gemini content generation failed:', error);
      throw new Error(`Failed to generate ${type} with Gemini`);
    }
  }

  private parseGameContent(type: string, content: string): any {
    // Parse the generated content into structured data
    // This is a simplified parser - in production, you'd want more robust parsing
    const lines = content.split('\n').filter(line => line.trim());
    
    switch (type) {
      case 'scene':
        return {
          title: lines[0]?.replace(/^(Title:|Scene:)\s*/i, '') || 'Untitled Scene',
          description: lines.slice(1, -3).join(' '),
          choices: lines.slice(-3).map((choice, index) => ({
            id: `choice_${index}`,
            text: choice.replace(/^\d+\.\s*/, ''),
            nextSceneId: ''
          }))
        };
      
      case 'character':
        return {
          name: lines[0]?.replace(/^(Name:|Character:)\s*/i, '') || 'Unnamed Character',
          description: lines.slice(1).join(' '),
          attributes: {
            health: 100,
            strength: Math.floor(Math.random() * 20) + 10,
            intelligence: Math.floor(Math.random() * 20) + 10,
            agility: Math.floor(Math.random() * 20) + 10
          }
        };
      
      case 'item':
        return {
          name: lines[0]?.replace(/^(Name:|Item:)\s*/i, '') || 'Unnamed Item',
          description: lines.slice(1).join(' '),
          type: 'misc',
          properties: {}
        };
      
      default:
        return { content };
    }
  }
}

export const geminiService = new GeminiService();