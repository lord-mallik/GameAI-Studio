import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIAsset, GameAssistantRequest, GameAssistantResponse } from '../types/ai';
import { novitaService } from '../services/novitaService';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface AIState {
  assets: AIAsset[];
  isGenerating: boolean;
  generationQueue: string[];
  assistantHistory: Array<{
    request: GameAssistantRequest;
    response: GameAssistantResponse;
    timestamp: Date;
  }>;
  apiKeys: {
    novita: string;
    gemini: string;
  };
  isConfigured: boolean;
}

interface AIContextType {
  state: AIState;
  generateAsset: (type: string, prompt: string) => Promise<AIAsset>;
  getAssistance: (request: GameAssistantRequest) => Promise<GameAssistantResponse>;
  clearHistory: () => void;
  setApiKeys: (keys: { novita?: string; gemini?: string }) => void;
  validateApiKeys: () => Promise<{ novita: boolean; gemini: boolean }>;
}

const AIContext = createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AIState>({
    assets: [],
    isGenerating: false,
    generationQueue: [],
    assistantHistory: [],
    apiKeys: {
      novita: '',
      gemini: ''
    },
    isConfigured: false
  });

  // Load saved settings on mount
  useEffect(() => {
    const settings = storageService.loadData<any>('settings');
    if (settings?.api) {
      const apiKeys = {
        novita: settings.api.novitaKey || '',
        gemini: settings.api.geminiKey || ''
      };
      
      setState(prev => ({
        ...prev,
        apiKeys,
        isConfigured: !!(apiKeys.novita && apiKeys.gemini)
      }));

      // Configure services
      if (apiKeys.novita) novitaService.setApiKey(apiKeys.novita);
      if (apiKeys.gemini) geminiService.setApiKey(apiKeys.gemini);
    }

    // Load saved assets
    const savedAssets = storageService.loadData<AIAsset[]>('assets') || [];
    setState(prev => ({ ...prev, assets: savedAssets }));
  }, []);

  const generateAsset = async (type: string, prompt: string): Promise<AIAsset> => {
    if (!state.apiKeys.novita) {
      throw new Error('Novita.AI API key not configured');
    }

    setState(prev => ({ 
      ...prev, 
      isGenerating: true,
      generationQueue: [...prev.generationQueue, prompt]
    }));
    
    try {
      const asset = await novitaService.generateImage({
        prompt,
        style: 'realistic',
        dimensions: '512x512',
        count: 1
      });

      setState(prev => ({
        ...prev,
        assets: [...prev.assets, asset],
        isGenerating: false,
        generationQueue: prev.generationQueue.filter(p => p !== prompt)
      }));

      // Save to storage
      const allAssets = [...state.assets, asset];
      storageService.saveData('assets', allAssets);

      return asset;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false,
        generationQueue: prev.generationQueue.filter(p => p !== prompt)
      }));
      throw error;
    }
  };

  const getAssistance = async (request: GameAssistantRequest): Promise<GameAssistantResponse> => {
    if (!state.apiKeys.gemini) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await geminiService.getGameAssistance(request);

      setState(prev => ({
        ...prev,
        assistantHistory: [...prev.assistantHistory, {
          request,
          response,
          timestamp: new Date()
        }]
      }));

      return response;
    } catch (error) {
      throw error;
    }
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, assistantHistory: [] }));
  };

  const setApiKeys = (keys: { novita?: string; gemini?: string }) => {
    const newApiKeys = {
      ...state.apiKeys,
      ...keys
    };

    setState(prev => ({
      ...prev,
      apiKeys: newApiKeys,
      isConfigured: !!(newApiKeys.novita && newApiKeys.gemini)
    }));

    // Configure services
    if (keys.novita) novitaService.setApiKey(keys.novita);
    if (keys.gemini) geminiService.setApiKey(keys.gemini);

    // Save to storage
    const settings = storageService.loadData<any>('settings') || {};
    settings.api = {
      ...settings.api,
      novitaKey: newApiKeys.novita,
      geminiKey: newApiKeys.gemini
    };
    storageService.saveData('settings', settings);
  };

  const validateApiKeys = async (): Promise<{ novita: boolean; gemini: boolean }> => {
    const results = {
      novita: false,
      gemini: false
    };

    try {
      if (state.apiKeys.novita) {
        results.novita = await novitaService.validateApiKey(state.apiKeys.novita);
      }
    } catch (error) {
      console.error('Novita API validation failed:', error);
    }

    try {
      if (state.apiKeys.gemini) {
        results.gemini = await geminiService.validateApiKey(state.apiKeys.gemini);
      }
    } catch (error) {
      console.error('Gemini API validation failed:', error);
    }

    return results;
  };

  return (
    <AIContext.Provider value={{ 
      state, 
      generateAsset, 
      getAssistance, 
      clearHistory, 
      setApiKeys,
      validateApiKeys
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}