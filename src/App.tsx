import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import GameBuilder from './pages/GameBuilder';
import AssetLibrary from './pages/AssetLibrary';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { GameProvider } from './contexts/GameContext';
import { AIProvider } from './contexts/AIContext';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AIProvider>
        <GameProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-white">
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/builder" element={<GameBuilder />} />
                  <Route path="/assets" element={<AssetLibrary />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1F2937',
                    color: '#F9FAFB',
                    border: '1px solid #374151'
                  }
                }}
              />
            </div>
          </Router>
        </GameProvider>
      </AIProvider>
    </DndProvider>
  );
}

export default App;