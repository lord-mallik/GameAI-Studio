import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Key, Bell, Palette, Globe, Shield, Database, CheckCircle, XCircle } from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import { storageService } from '../services/storageService';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { state: aiState, setApiKeys, validateApiKeys } = useAI();
  const [settings, setSettings] = useState({
    // API Settings
    novitaApiKey: '',
    geminiApiKey: '',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    
    // Appearance
    theme: 'dark',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    
    // Privacy
    dataCollection: true,
    analytics: false,
    shareUsage: false,
    
    // Performance
    autoSave: true,
    cacheAssets: true,
    maxAssetSize: '10MB'
  });

  const [apiValidation, setApiValidation] = useState({
    novita: false,
    gemini: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const savedSettings = storageService.loadData<any>('settings');
    if (savedSettings) {
      setSettings(prev => ({
        ...prev,
        ...savedSettings,
        novitaApiKey: savedSettings.api?.novitaKey || '',
        geminiApiKey: savedSettings.api?.geminiKey || ''
      }));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApiKeyChange = (key: 'novitaApiKey' | 'geminiApiKey', value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update AI context
    if (key === 'novitaApiKey') {
      setApiKeys({ novita: value });
    } else {
      setApiKeys({ gemini: value });
    }
  };

  const validateApiKeysHandler = async () => {
    setIsValidating(true);
    try {
      const results = await validateApiKeys();
      setApiValidation(results);
      
      if (results.novita && results.gemini) {
        toast.success('All API keys are valid');
      } else {
        toast.error('Some API keys are invalid');
      }
    } catch (error) {
      toast.error('Failed to validate API keys');
    } finally {
      setIsValidating(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = {
        ...settings,
        api: {
          novitaKey: settings.novitaApiKey,
          geminiKey: settings.geminiApiKey
        }
      };

      // Remove API keys from main settings object
      delete settingsToSave.novitaApiKey;
      delete settingsToSave.geminiApiKey;

      storageService.saveData('settings', settingsToSave);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      id: 'api',
      title: 'API Configuration',
      icon: Key,
      description: 'Configure your AI service API keys'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your data and privacy settings'
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: Database,
      description: 'Optimize app performance and storage'
    }
  ];

  const [activeSection, setActiveSection] = useState('api');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your GameAI Studio preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          className="lg:w-80 bg-gray-800 border border-gray-700 rounded-xl p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{section.title}</div>
                    <div className="text-sm opacity-80">{section.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          key={activeSection}
        >
          {activeSection === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">API Configuration</h2>
                <button
                  onClick={validateApiKeysHandler}
                  disabled={isValidating}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
                >
                  {isValidating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>Validate Keys</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Novita.AI API Key
                    </label>
                    {settings.novitaApiKey && (
                      apiValidation.novita ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )
                    )}
                  </div>
                  <input
                    type="password"
                    value={settings.novitaApiKey}
                    onChange={(e) => handleApiKeyChange('novitaApiKey', e.target.value)}
                    placeholder="Enter your Novita.AI API key..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Used for generating visual assets like characters and environments
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Google Gemini API Key
                    </label>
                    {settings.geminiApiKey && (
                      apiValidation.gemini ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )
                    )}
                  </div>
                  <input
                    type="password"
                    value={settings.geminiApiKey}
                    onChange={(e) => handleApiKeyChange('geminiApiKey', e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Powers the AI assistant for game development help
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <h3 className="text-blue-400 font-medium mb-2">Getting API Keys</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      <strong>Novita.AI:</strong> Visit{' '}
                      <a href="https://novita.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        novita.ai
                      </a>{' '}
                      to create an account and get your API key
                    </p>
                    <p>
                      <strong>Google Gemini:</strong> Visit{' '}
                      <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        Google AI Studio
                      </a>{' '}
                      to generate your API key
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Summary of your activity' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">{item.label}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Appearance & Localization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'dataCollection', label: 'Data Collection', desc: 'Allow anonymous usage data collection' },
                  { key: 'analytics', label: 'Analytics', desc: 'Help improve the app with usage analytics' },
                  { key: 'shareUsage', label: 'Share Usage Data', desc: 'Share aggregated data with partners' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">{item.label}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'performance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Performance & Storage</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Auto Save</h3>
                    <p className="text-gray-400 text-sm">Automatically save changes every 30 seconds</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Asset Size
                  </label>
                  <select
                    value={settings.maxAssetSize}
                    onChange={(e) => handleSettingChange('maxAssetSize', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5MB">5 MB</option>
                    <option value="10MB">10 MB</option>
                    <option value="25MB">25 MB</option>
                    <option value="50MB">50 MB</option>
                  </select>
                </div>

                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Storage Usage</h3>
                  <div className="space-y-2">
                    {(() => {
                      const usage = storageService.getStorageUsage();
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Used:</span>
                            <span className="text-white">{(usage.used / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400">
                            {usage.percentage.toFixed(1)}% of available storage used
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button 
              onClick={saveSettings}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;