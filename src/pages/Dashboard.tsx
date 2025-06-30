import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Gamepad2, Image, Brain, TrendingUp } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import StatCard from '../components/Dashboard/StatCard';
import RecentProjects from '../components/Dashboard/RecentProjects';
import AIAssistant from '../components/Dashboard/AIAssistant';
import QuickActions from '../components/Dashboard/QuickActions';

const Dashboard: React.FC = () => {
  const { state } = useGame();

  const stats = [
    {
      title: 'Active Projects',
      value: state.projects.length.toString(),
      change: '+2 this week',
      icon: Gamepad2,
      color: 'blue'
    },
    {
      title: 'AI Assets Generated',
      value: '1,247',
      change: '+156 today',
      icon: Image,
      color: 'emerald'
    },
    {
      title: 'AI Interactions',
      value: '89',
      change: '+12 today',
      icon: Brain,
      color: 'purple'
    },
    {
      title: 'Performance Score',
      value: '94%',
      change: '+3% this month',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to GameAI Studio
        </h1>
        <p className="text-gray-400">
          Create amazing text-based adventure games with the power of AI
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecentProjects />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      {/* AI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <AIAssistant />
      </motion.div>
    </div>
  );
};

export default Dashboard;