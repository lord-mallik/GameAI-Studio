import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '../services/storageService';
import { novitaService } from '../services/novitaService';
import { geminiService } from '../services/geminiService';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Storage Service', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should save and load data correctly', () => {
    const testData = { test: 'value' };
    
    storageService.saveData('projects', testData);
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      projects: testData,
      version: '1.0.0'
    }));
    
    const loaded = storageService.loadData('projects');
    expect(loaded).toEqual(testData);
  });

  it('should handle storage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage full');
    });
    
    expect(() => {
      storageService.saveData('projects', { large: 'data' });
    }).toThrow('Storage operation failed');
  });

  it('should return default data when storage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const loaded = storageService.loadData('projects');
    expect(loaded).toBeNull();
  });
});

describe('Novita Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate API key format', async () => {
    const validKey = 'nvta_sk_test_12345';
    const invalidKey = 'invalid_key';
    
    // Mock successful validation
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true })
    });
    
    novitaService.setApiKey(validKey);
    const isValid = await novitaService.validateApiKey(validKey);
    expect(isValid).toBe(true);
  });

  it('should handle generation errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    novitaService.setApiKey('test_key');
    
    await expect(novitaService.generateImage({
      prompt: 'test',
      style: 'realistic',
      dimensions: '512x512',
      count: 1
    })).rejects.toThrow('Failed to generate image with Novita.AI');
  });
});

describe('Gemini Service', () => {
  it('should handle API key validation', async () => {
    const mockGenAI = {
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: vi.fn().mockResolvedValue('Test response')
        })
      })
    };
    
    // Mock GoogleGenerativeAI constructor
    vi.mock('@google/generative-ai', () => ({
      GoogleGenerativeAI: vi.fn().mockImplementation(() => mockGenAI)
    }));
    
    const isValid = await geminiService.validateApiKey('test_key');
    expect(isValid).toBe(true);
  });

  it('should generate story content', async () => {
    const mockResponse = 'Generated story content';
    const mockModel = {
      generateContent: vi.fn().mockResolvedValue({
        response: vi.fn().mockResolvedValue(mockResponse)
      })
    };
    
    geminiService.setApiKey('test_key');
    // Mock the model
    (geminiService as any).model = mockModel;
    
    const story = await geminiService.generateStory('Create a fantasy story');
    expect(story).toBe(mockResponse);
  });
});

// Integration Tests
describe('Game Builder Integration', () => {
  it('should create a complete game project', async () => {
    // Test project creation workflow
    const projectData = {
      name: 'Test Game',
      description: 'A test adventure',
      genre: 'Fantasy'
    };
    
    // Save project
    storageService.saveData('projects', [projectData]);
    
    // Verify storage
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      projects: [projectData],
      version: '1.0.0'
    }));
    
    const projects = storageService.loadData('projects');
    expect(projects).toContain(projectData);
  });

  it('should handle asset generation workflow', async () => {
    // Mock successful asset generation
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        status: 200,
        data: { task_id: 'test_task' }
      })
      .mockResolvedValueOnce({
        status: 200,
        data: {
          task: {
            status: 'TASK_STATUS_SUCCEED',
            imgs: [{ url: 'https://example.com/image.jpg' }]
          }
        }
      });
    
    novitaService.setApiKey('test_key');
    
    const asset = await novitaService.generateImage({
      prompt: 'fantasy character',
      style: 'realistic',
      dimensions: '512x512',
      count: 1
    });
    
    expect(asset).toHaveProperty('url');
    expect(asset).toHaveProperty('type');
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('should handle large data sets efficiently', () => {
    const startTime = performance.now();
    
    // Generate large dataset
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Project ${i}`,
      data: 'x'.repeat(100)
    }));
    
    storageService.saveData('projects', largeData);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (1 second)
    expect(duration).toBeLessThan(1000);
  });

  it('should handle concurrent operations', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      storageService.saveData('test', { id: i })
    );
    
    // Should not throw errors
    await expect(Promise.all(promises)).resolves.not.toThrow();
  });
});

// Error Handling Tests
describe('Error Handling', () => {
  it('should handle network failures gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    await expect(novitaService.validateApiKey('test')).resolves.toBe(false);
  });

  it('should handle malformed API responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ invalid: 'response' })
    });
    
    await expect(novitaService.generateImage({
      prompt: 'test',
      style: 'realistic',
      dimensions: '512x512',
      count: 1
    })).rejects.toThrow();
  });

  it('should handle storage quota exceeded', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    
    expect(() => {
      storageService.saveData('projects', { large: 'data'.repeat(10000) });
    }).toThrow('Storage operation failed');
  });
});

export { describe, it, expect };