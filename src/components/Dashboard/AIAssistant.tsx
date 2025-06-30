import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Lightbulb } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';
import toast from 'react-hot-toast';

const AIAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { state, getAssistance } = useAI();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!state.isConfigured) {
      toast.error('Please configure your API keys in Settings');
      return;
    }

    setIsTyping(true);
    try {
      await getAssistance({
        type: 'story',
        context: 'dashboard',
        request: message
      });
      setMessage('');
      toast.success('AI response received');
    } catch (error) {
      console.error('Failed to get AI assistance:', error);
      toast.error('Failed to get AI assistance. Please check your API configuration.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const suggestions = [
    "Help me create a fantasy adventure story",
    "Generate character ideas for my game",
    "What are some good game mechanics for beginners?",
    "How can I improve my game's pacing?"
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
          <p className="text-gray-400 text-sm">Get instant help with your game development</p>
        </div>
      </div>

      {!state.isConfigured && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <p className="text-yellow-400 text-sm">
            Configure your API keys in Settings to enable AI assistance.
          </p>
        </div>
      )}

      {/* Recent Conversations */}
      <div className="mb-6 max-h-60 overflow-y-auto space-y-3">
        {state.assistantHistory.slice(-3).map((interaction, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                {interaction.request.request}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-200 p-3 rounded-lg max-w-xs">
                {interaction.response.content}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-700 text-gray-200 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-400">Suggestions:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-left p-2 text-sm text-gray-300 bg-gray-750 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything about game development..."
          className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={!state.isConfigured}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isTyping || !state.isConfigured}
          className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;