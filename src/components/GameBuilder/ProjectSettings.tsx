import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Share, Trash2 } from 'lucide-react';

const ProjectSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    name: 'The Enchanted Forest Adventure',
    description: 'A mystical journey through an ancient forest filled with magic and mystery.',
    genre: 'Fantasy',
    difficulty: 'Normal',
    theme: 'Dark',
    enableSaving: true,
    enableMusic: true,
    enableVoice: false,
    maxSaveSlots: 3,
    language: 'English'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportFormats = [
    { id: 'html', name: 'HTML Package', description: 'Standalone HTML file with embedded assets' },
    { id: 'json', name: 'JSON Data', description: 'Game data for custom implementations' },
    { id: 'twine', name: 'Twine Format', description: 'Compatible with Twine story format' },
    { id: 'ink', name: 'Ink Script', description: 'For use with Unity and other engines' }
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Project Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-750 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Project Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={settings.genre}
                onChange={(e) => handleSettingChange('genre', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Adventure">Adventure</option>
                <option value="Romance">Romance</option>
                <option value="Historical">Historical</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your game..."
            />
          </div>
        </motion.section>

        {/* Game Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-750 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Game Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Visual Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Dark">Dark</option>
                <option value="Light">Light</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Retro">Retro</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Enable Save System</h3>
                <p className="text-gray-400 text-sm">Allow players to save their progress</p>
              </div>
              <button
                onClick={() => handleSettingChange('enableSaving', !settings.enableSaving)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableSaving ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableSaving ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Background Music</h3>
                <p className="text-gray-400 text-sm">Play ambient music during gameplay</p>
              </div>
              <button
                onClick={() => handleSettingChange('enableMusic', !settings.enableMusic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableMusic ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableMusic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Voice Narration</h3>
                <p className="text-gray-400 text-sm">Text-to-speech for story content</p>
              </div>
              <button
                onClick={() => handleSettingChange('enableVoice', !settings.enableVoice)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableVoice ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableVoice ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Export Options */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-750 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Export & Sharing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportFormats.map((format) => (
              <motion.button
                key={format.id}
                className="p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500 rounded-lg text-left transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium group-hover:text-blue-400">
                    {format.name}
                  </h3>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </div>
                <p className="text-gray-400 text-sm">{format.description}</p>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Share className="w-4 h-4" />
              <span>Share Project</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-900/20 border border-red-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-gray-400 mb-4">
            These actions cannot be undone. Please proceed with caution.
          </p>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Delete Project</span>
          </button>
        </motion.section>
      </div>
    </div>
  );
};

export default ProjectSettings;