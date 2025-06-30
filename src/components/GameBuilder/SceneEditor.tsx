import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Move, Image } from 'lucide-react';
import { useDrop } from 'react-dnd';

const SceneEditor: React.FC = () => {
  const [scenes, setScenes] = useState([
    {
      id: '1',
      title: 'The Mysterious Forest',
      description: 'You find yourself at the edge of a dark, enchanted forest. Ancient trees tower above you, their branches creating intricate shadows on the forest floor.',
      choices: [
        { id: '1a', text: 'Enter the forest cautiously', nextScene: '2' },
        { id: '1b', text: 'Look for another path', nextScene: '3' }
      ],
      image: null
    }
  ]);
  
  const [selectedScene, setSelectedScene] = useState(scenes[0]);

  const [{ isOver }, drop] = useDrop({
    accept: 'asset',
    drop: (item: any) => {
      // Handle asset drop
      console.log('Dropped asset:', item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const addChoice = () => {
    const newChoice = {
      id: Date.now().toString(),
      text: 'New choice',
      nextScene: ''
    };
    
    setSelectedScene({
      ...selectedScene,
      choices: [...selectedScene.choices, newChoice]
    });
  };

  const updateChoice = (choiceId: string, field: string, value: string) => {
    setSelectedScene({
      ...selectedScene,
      choices: selectedScene.choices.map(choice =>
        choice.id === choiceId ? { ...choice, [field]: value } : choice
      )
    });
  };

  const removeChoice = (choiceId: string) => {
    setSelectedScene({
      ...selectedScene,
      choices: selectedScene.choices.filter(choice => choice.id !== choiceId)
    });
  };

  return (
    <div className="h-full flex">
      {/* Scene List */}
      <div className="w-64 border-r border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Scenes</h3>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-2">
          {scenes.map((scene) => (
            <motion.div
              key={scene.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedScene.id === scene.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedScene(scene)}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium truncate">{scene.title}</h4>
              <p className="text-sm opacity-80 truncate">{scene.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scene Editor */}
      <div 
        ref={drop}
        className={`flex-1 p-6 overflow-y-auto ${isOver ? 'bg-blue-900/20' : ''}`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Scene Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scene Title
            </label>
            <input
              type="text"
              value={selectedScene.title}
              onChange={(e) => setSelectedScene({ ...selectedScene, title: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scene Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={selectedScene.description}
              onChange={(e) => setSelectedScene({ ...selectedScene, description: e.target.value })}
              rows={6}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe what the player sees and experiences in this scene..."
            />
          </div>

          {/* Scene Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scene Image
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
              {selectedScene.image ? (
                <img src={selectedScene.image} alt="Scene" className="max-w-full h-48 mx-auto rounded-lg" />
              ) : (
                <div className="text-gray-400">
                  <Image className="w-12 h-12 mx-auto mb-2" />
                  <p>Drop an image here or click to upload</p>
                  <p className="text-sm">Or drag from the Asset Library</p>
                </div>
              )}
            </div>
          </div>

          {/* Choices */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Player Choices
              </label>
              <button
                onClick={addChoice}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Choice</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedScene.choices.map((choice, index) => (
                <motion.div
                  key={choice.id}
                  className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Move className="w-4 h-4 cursor-grab" />
                    <span className="text-sm">{index + 1}</span>
                  </div>
                  
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => updateChoice(choice.id, 'text', e.target.value)}
                    className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Choice text..."
                  />
                  
                  <select
                    value={choice.nextScene}
                    onChange={(e) => updateChoice(choice.id, 'nextScene', e.target.value)}
                    className="p-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select next scene</option>
                    {scenes.map((scene) => (
                      <option key={scene.id} value={scene.id}>{scene.title}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => removeChoice(choice.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneEditor;