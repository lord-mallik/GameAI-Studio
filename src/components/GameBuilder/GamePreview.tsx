import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Settings } from 'lucide-react';

const GamePreview: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameState, setGameState] = useState({
    health: 100,
    inventory: [] as string[],
    flags: {} as Record<string, boolean>
  });

  const mockScenes = [
    {
      id: 0,
      title: 'The Mysterious Forest',
      description: 'You find yourself at the edge of a dark, enchanted forest. Ancient trees tower above you, their branches creating intricate shadows on the forest floor. A gentle breeze carries the scent of moss and wildflowers.',
      image: 'https://picsum.photos/800/400?random=1',
      choices: [
        { text: 'Enter the forest cautiously', nextScene: 1 },
        { text: 'Look for another path around the forest', nextScene: 2 },
        { text: 'Call out to see if anyone is nearby', nextScene: 3 }
      ]
    },
    {
      id: 1,
      title: 'Deeper Into the Woods',
      description: 'As you step into the forest, the canopy above blocks out most of the sunlight. You hear the soft rustling of leaves and distant bird calls. Ahead, you notice a fork in the path.',
      image: 'https://picsum.photos/800/400?random=2',
      choices: [
        { text: 'Take the left path', nextScene: 0 },
        { text: 'Take the right path', nextScene: 2 },
        { text: 'Rest and listen carefully', nextScene: 3 }
      ]
    },
    {
      id: 2,
      title: 'The Clearing',
      description: 'You discover a beautiful clearing bathed in golden sunlight. In the center stands an ancient stone well, covered in mysterious runes that seem to glow faintly.',
      image: 'https://picsum.photos/800/400?random=3',
      choices: [
        { text: 'Examine the well closely', nextScene: 0 },
        { text: 'Circle around the clearing', nextScene: 1 },
        { text: 'Touch the glowing runes', nextScene: 3 }
      ]
    },
    {
      id: 3,
      title: 'A Strange Encounter',
      description: 'Your call echoes through the forest, and to your surprise, a voice answers back. From behind a large oak tree steps a hooded figure carrying a wooden staff.',
      image: 'https://picsum.photos/800/400?random=4',
      choices: [
        { text: 'Greet the stranger politely', nextScene: 0 },
        { text: 'Ask who they are', nextScene: 1 },
        { text: 'Step back cautiously', nextScene: 2 }
      ]
    }
  ];

  const currentSceneData = mockScenes[currentScene];

  const handleChoice = (nextScene: number) => {
    setCurrentScene(nextScene);
  };

  const resetGame = () => {
    setCurrentScene(0);
    setGameState({
      health: 100,
      inventory: [],
      flags: {}
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
          
          <div className="text-sm text-gray-400">
            Scene {currentScene + 1} of {mockScenes.length}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Health: <span className="text-green-400">{gameState.health}</span>
          </div>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Game Display */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Scene Image */}
          <motion.div
            key={currentScene}
            className="aspect-video rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={currentSceneData.image}
              alt={currentSceneData.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Scene Content */}
          <motion.div
            key={`content-${currentScene}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentSceneData.title}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {currentSceneData.description}
            </p>
          </motion.div>

          {/* Choices */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {currentSceneData.choices.map((choice, index) => (
              <motion.button
                key={index}
                onClick={() => handleChoice(choice.nextScene)}
                className="w-full p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500 rounded-lg text-left transition-all group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 group-hover:bg-blue-500 rounded-full flex items-center justify-center text-white font-medium transition-colors">
                    {index + 1}
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors">
                    {choice.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Game Stats */}
          <motion.div
            className="mt-8 p-4 bg-gray-800/50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-2">Debug Info</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Current Scene:</span>
                <span className="text-white ml-2">{currentScene}</span>
              </div>
              <div>
                <span className="text-gray-500">Health:</span>
                <span className="text-green-400 ml-2">{gameState.health}</span>
              </div>
              <div>
                <span className="text-gray-500">Inventory:</span>
                <span className="text-blue-400 ml-2">{gameState.inventory.length} items</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePreview;