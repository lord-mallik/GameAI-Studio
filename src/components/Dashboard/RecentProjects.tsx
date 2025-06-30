import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Calendar, Users, Play } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const RecentProjects: React.FC = () => {
  const { state } = useGame();

  const mockProjects = [
    {
      id: '1',
      name: 'The Enchanted Forest',
      description: 'A mystical adventure through ancient woods',
      genre: 'Fantasy',
      updated: '2 hours ago',
      status: 'In Progress',
      thumbnail: 'https://picsum.photos/64/64?random=1'
    },
    {
      id: '2',
      name: 'Cyberpunk Detective',
      description: 'Solve crimes in a neon-lit future city',
      genre: 'Sci-Fi',
      updated: '1 day ago',
      status: 'Testing',
      thumbnail: 'https://picsum.photos/64/64?random=2'
    },
    {
      id: '3',
      name: 'Pirate\'s Treasure',
      description: 'Search for buried gold on the high seas',
      genre: 'Adventure',
      updated: '3 days ago',
      status: 'Complete',
      thumbnail: 'https://picsum.photos/64/64?random=3'
    }
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="flex items-center space-x-4 p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {project.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Gamepad2 className="w-3 h-3" />
                  <span>{project.genre}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{project.updated}</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === 'Complete' ? 'bg-emerald-400/10 text-emerald-400' :
                project.status === 'Testing' ? 'bg-orange-400/10 text-orange-400' :
                'bg-blue-400/10 text-blue-400'
              }`}>
                {project.status}
              </span>
              <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                <Play className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;