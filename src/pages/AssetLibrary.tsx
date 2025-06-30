import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Grid, List, Filter, Search, Sparkles } from 'lucide-react';

const AssetLibrary: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Asset Library</h1>
          <p className="text-gray-400">Manage and generate visual assets for your games</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <Sparkles className="w-4 h-4" />
            <span>Generate with AI</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by name, type, or tags..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button className="p-2 bg-blue-600 rounded-md">
                <Grid className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-600 rounded-md transition-colors">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Asset Categories */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { name: 'Characters', count: 24, color: 'blue' },
          { name: 'Environments', count: 18, color: 'emerald' },
          { name: 'Items', count: 56, color: 'purple' },
          { name: 'UI Elements', count: 32, color: 'orange' }
        ].map((category, index) => (
          <motion.div
            key={category.name}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <h3 className="text-white font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-400 text-sm">{category.count} assets</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Asset Grid */}
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }, (_, i) => (
            <motion.div
              key={i}
              className="aspect-square bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer group relative"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.02 }}
            >
              <img
                src={`https://picsum.photos/200/200?random=${i + 20}`}
                alt={`Asset ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
                  Use Asset
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AssetLibrary;