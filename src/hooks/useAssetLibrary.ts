import { useState, useCallback } from 'react';
import { useAI } from '../contexts/AIContext';
import { novitaService } from '../services/novitaService';
import { storageService } from '../services/storageService';
import { AIAsset, NovitaImageRequest } from '../types/ai';
import toast from 'react-hot-toast';

export function useAssetLibrary() {
  const { state, generateAsset } = useAI();
  const [isUploading, setIsUploading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    style: 'all',
    search: ''
  });

  const uploadAsset = useCallback(async (file: File): Promise<AIAsset | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return null;
    }

    setIsUploading(true);
    try {
      // Convert file to base64 for storage
      const base64 = await fileToBase64(file);
      
      const asset: AIAsset = {
        id: `upload_${Date.now()}`,
        type: inferAssetTypeFromFilename(file.name),
        prompt: `Uploaded: ${file.name}`,
        url: base64,
        thumbnail: base64,
        metadata: {
          style: 'uploaded',
          dimensions: 'unknown',
          generated: new Date(),
          provider: 'User Upload'
        }
      };

      // Save to storage
      const assets = storageService.loadData<AIAsset[]>('assets') || [];
      assets.push(asset);
      storageService.saveData('assets', assets);

      toast.success('Asset uploaded successfully');
      return asset;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload asset');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const generateAssetWithAI = useCallback(async (
    type: string, 
    prompt: string, 
    style: string = 'realistic',
    dimensions: string = '512x512'
  ): Promise<AIAsset | null> => {
    try {
      const request: NovitaImageRequest = {
        prompt,
        style: style as any,
        dimensions: dimensions as any,
        count: 1
      };

      const asset = await novitaService.generateImage(request);
      
      // Save to storage
      const assets = storageService.loadData<AIAsset[]>('assets') || [];
      assets.push(asset);
      storageService.saveData('assets', assets);

      toast.success('AI asset generated successfully');
      return asset;
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error('Failed to generate asset with AI');
      return null;
    }
  }, []);

  const deleteAsset = useCallback((assetId: string) => {
    try {
      const assets = storageService.loadData<AIAsset[]>('assets') || [];
      const filteredAssets = assets.filter(asset => asset.id !== assetId);
      storageService.saveData('assets', filteredAssets);
      toast.success('Asset deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete asset');
    }
  }, []);

  const getFilteredAssets = useCallback(() => {
    const allAssets = [
      ...state.assets,
      ...(storageService.loadData<AIAsset[]>('assets') || [])
    ];

    return allAssets.filter(asset => {
      const matchesType = filters.type === 'all' || asset.type === filters.type;
      const matchesStyle = filters.style === 'all' || asset.metadata.style === filters.style;
      const matchesSearch = !filters.search || 
        asset.prompt.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesStyle && matchesSearch;
    });
  }, [state.assets, filters]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const exportAssets = useCallback(() => {
    try {
      const assets = getFilteredAssets();
      const exportData = JSON.stringify(assets, null, 2);
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'assets_export.json';
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Assets exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export assets');
    }
  }, [getFilteredAssets]);

  return {
    assets: getFilteredAssets(),
    isUploading,
    filters,
    uploadAsset,
    generateAssetWithAI,
    deleteAsset,
    updateFilters,
    exportAssets
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function inferAssetTypeFromFilename(filename: string): 'character' | 'environment' | 'item' | 'ui' {
  const lower = filename.toLowerCase();
  
  if (lower.includes('char') || lower.includes('person') || lower.includes('npc')) {
    return 'character';
  } else if (lower.includes('bg') || lower.includes('background') || lower.includes('scene')) {
    return 'environment';
  } else if (lower.includes('item') || lower.includes('weapon') || lower.includes('tool')) {
    return 'item';
  } else {
    return 'ui';
  }
}