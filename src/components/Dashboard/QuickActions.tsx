import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Wand2, Image, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { GameProject } from '../../types/game';
import { storageService } from '../../services/storageService';
import toast from 'react-hot-toast';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const createNewProject = () => {
    const newProject: GameProject = {
      id: `project_${Date.now()}`,
      name: 'New Adventure Game',
      description: 'An exciting new text-based adventure awaits!',
      genre: 'Fantasy',
      created: new Date(),
      updated: new Date(),
      scenes: [],
      characters: [],
      items: [],
      variables: {},
      settings: {
        theme: 'dark',
        difficulty: 'normal',
        enableSaving: true,
        enableMusic: true,
        enableVoice: false
      }
    };

    dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject });
    navigate('/builder');
    toast.success('New project created!');
  };

  const createAIProject = () => {
    navigate('/builder?mode=ai');
    toast.info('AI Story Generator activated');
  };

  const openAssetLibrary = () => {
    navigate('/assets');
  };

  const exportCurrentProject = () => {
    try {
      const projects = storageService.loadData<GameProject[]>('projects') || [];
      if (projects.length === 0) {
        toast.error('No projects to export');
        return;
      }

      const latestProject = projects[projects.length - 1];
      const exportData = JSON.stringify(latestProject, null, 2);
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${latestProject.name}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Project exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export project');
    }
  };

  const actions = [
    {
      icon: Plus,
      title: 'New Project',
      description: 'Create a new game from scratch',
      color: 'blue',
      onClick: createNewProject
    },
    {
      icon: Wand2,
      title: 'AI Story Generator',
      description: 'Generate story with AI assistance',
      color: 'purple',
      onClick: createAIProject
    },
    {
      icon: Image,
      title: 'Generate Assets',
      description: 'Create visual assets with AI',
      color: 'emerald',
      onClick: openAssetLibrary
    },
    {
      icon: Download,
      title: 'Export Game',
      description: 'Download your completed game',
      color: 'orange',
      onClick: exportCurrentProject
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.title}
              className={`w-full p-4 bg-gradient-to-r ${colorClasses[action.color as keyof typeof colorClasses]} rounded-lg transition-all group`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-white" />
                <div className="text-left">
                  <h3 className="text-white font-medium">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;