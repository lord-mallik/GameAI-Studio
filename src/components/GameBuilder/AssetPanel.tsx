import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Image, Users, Package, Sparkles, Upload } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { useAssetLibrary } from '../../hooks/useAssetLibrary';
import { useAI } from '../../contexts/AIContext';
import toast from 'react-hot-toast';

interface AssetPanelProps {
  onClose: () => void;
}

const AssetPanel: React.FC<AssetPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'characters' | 'environments' | 'items'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const { assets, filters, updateFilters, uploadAsset, generateAssetWithAI, isUploading } = useAssetLibrary();
  const { state: aiState } = useAI();

  const tabs = [
    { id: 'all', label: 'All Assets', icon: Package },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'environments', label: 'Environments', icon: Image },
    { id: 'items', label: 'Items', icon: Package },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateFilters({ search: term });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    updateFilters({ type: tab === 'all' ? 'all' : tab.slice(0, -1) });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAsset(file);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesTab = activeTab === 'all' || asset.type === activeTab.slice(0, -1);
    const matchesSearch = !searchTerm || 
      asset.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Asset Library</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-gray-700 space-y-3">
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate with AI</span>
        </button>

        <label className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Asset'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* AI Generator Panel */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-700 bg-gray-750"
          >
            <AIGenerator onGenerate={generateAssetWithAI} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredAssets.map((asset) => (
            <DraggableAsset key={asset.id} asset={asset} />
          ))}
        </div>
        
        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No assets found</p>
            <p className="text-sm">Try adjusting your search or generate new assets with AI</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DraggableAsset: React.FC<{ asset: any }> = ({ asset }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'asset',
    item: asset,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      className={`bg-gray-700 rounded-lg overflow-hidden cursor-grab hover:bg-gray-600 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={asset.thumbnail || asset.url}
        alt={asset.prompt}
        className="w-full aspect-square object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://picsum.photos/128/128?random=${asset.id}`;
        }}
      />
      <div className="p-2">
        <h3 className="text-white text-sm font-medium truncate">
          {asset.prompt.length > 20 ? asset.prompt.substring(0, 20) + '...' : asset.prompt}
        </h3>
        <p className="text-gray-400 text-xs capitalize">{asset.type}</p>
      </div>
    </motion.div>
  );
};

const AIGenerator: React.FC<{ onGenerate: (type: string, prompt: string, style?: string, dimensions?: string) => Promise<any> }> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('character');
  const [style, setStyle] = useState('realistic');
  const [dimensions, setDimensions] = useState('512x512');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    setIsGenerating(true);
    try {
      await onGenerate(type, prompt, style, dimensions);
      setPrompt('');
      toast.success('Asset generated successfully!');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate asset. Please check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Asset Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="character">Character</option>
            <option value="environment">Environment</option>
            <option value="item">Item</option>
            <option value="ui">UI Element</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="realistic">Realistic</option>
            <option value="anime">Anime</option>
            <option value="fantasy">Fantasy</option>
            <option value="scifi">Sci-Fi</option>
            <option value="pixel">Pixel Art</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
          rows={3}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded transition-colors flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Generate</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AssetPanel;