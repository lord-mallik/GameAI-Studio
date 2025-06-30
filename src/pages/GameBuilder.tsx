import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Play, Eye, Settings } from 'lucide-react';
import SceneEditor from '../components/GameBuilder/SceneEditor';
import GamePreview from '../components/GameBuilder/GamePreview';
import ProjectSettings from '../components/GameBuilder/ProjectSettings';
import AssetPanel from '../components/GameBuilder/AssetPanel';
import { useGameBuilder } from '../hooks/useGameBuilder';

const GameBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'settings'>('editor');
  const [showAssetPanel, setShowAssetPanel] = useState(true);
  const { saveProject, testGame, isSaving } = useGameBuilder();

  const tabs = [
    { id: 'editor', label: 'Editor', icon: Settings },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSave = async () => {
    await saveProject();
  };

  const handleTestGame = () => {
    testGame();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Game Builder</h1>
          <p className="text-gray-400">Create your interactive adventure</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-gray-300" />
            )}
            <span className="text-gray-300">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          
          <button 
            onClick={handleTestGame}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4 text-white" />
            <span className="text-white">Test Game</span>
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="flex space-x-1 mb-6 bg-gray-800 border border-gray-700 rounded-xl p-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex space-x-6 min-h-0">
        {/* Main Panel */}
        <motion.div
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'editor' && <SceneEditor />}
          {activeTab === 'preview' && <GamePreview />}
          {activeTab === 'settings' && <ProjectSettings />}
        </motion.div>

        {/* Asset Panel */}
        {showAssetPanel && (
          <motion.div
            className="w-80 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AssetPanel onClose={() => setShowAssetPanel(false)} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GameBuilder;