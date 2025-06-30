import axios from 'axios';
import { NovitaImageRequest, AIAsset } from '../types/ai';

class NovitaService {
  private apiKey: string = '';
  private baseURL = 'https://api.novita.ai/v3/async';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async generateImage(request: NovitaImageRequest): Promise<AIAsset> {
    if (!this.apiKey) {
      throw new Error('Novita.AI API key not configured');
    }

    try {
      // Submit generation request
      const response = await axios.post(`${this.baseURL}/txt2img`, {
        model_name: 'sd_xl_base_1.0.safetensors',
        prompt: request.prompt,
        negative_prompt: 'blurry, low quality, distorted',
        width: parseInt(request.dimensions.split('x')[0]),
        height: parseInt(request.dimensions.split('x')[1]),
        image_num: request.count,
        steps: 20,
        seed: -1,
        clip_skip: 1,
        guidance_scale: 7.5,
        sampler_name: 'Euler a'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const taskId = response.data.task_id;
      
      // Poll for completion
      const result = await this.pollForCompletion(taskId);
      
      return {
        id: Date.now().toString(),
        type: this.inferAssetType(request.prompt),
        prompt: request.prompt,
        url: result.imgs[0].url,
        thumbnail: result.imgs[0].url,
        metadata: {
          style: request.style,
          dimensions: request.dimensions,
          generated: new Date(),
          provider: 'Novita.AI'
        }
      };
    } catch (error) {
      console.error('Novita.AI generation failed:', error);
      throw new Error('Failed to generate image with Novita.AI');
    }
  }

  private async pollForCompletion(taskId: string, maxAttempts = 30): Promise<any> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get(`${this.baseURL}/progress/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });

        if (response.data.task.status === 'TASK_STATUS_SUCCEED') {
          return response.data.task;
        } else if (response.data.task.status === 'TASK_STATUS_FAILED') {
          throw new Error('Generation task failed');
        }

        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }
    
    throw new Error('Generation timeout');
  }

  private inferAssetType(prompt: string): 'character' | 'environment' | 'item' | 'ui' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('character') || lowerPrompt.includes('person') || 
        lowerPrompt.includes('warrior') || lowerPrompt.includes('mage')) {
      return 'character';
    } else if (lowerPrompt.includes('landscape') || lowerPrompt.includes('forest') || 
               lowerPrompt.includes('castle') || lowerPrompt.includes('room')) {
      return 'environment';
    } else if (lowerPrompt.includes('sword') || lowerPrompt.includes('potion') || 
               lowerPrompt.includes('treasure') || lowerPrompt.includes('item')) {
      return 'item';
    } else {
      return 'ui';
    }
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/user/info`, {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export const novitaService = new NovitaService();