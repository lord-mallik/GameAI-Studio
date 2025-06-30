import { useState, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { GameScene, Choice, GameProject } from '../types/game';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

export function useGameBuilder() {
  const { state, dispatch } = useGame();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveProject = useCallback(async () => {
    if (!state.currentProject) {
      toast.error('No project to save');
      return false;
    }

    setIsSaving(true);
    try {
      const projects = storageService.loadData<GameProject[]>('projects') || [];
      const existingIndex = projects.findIndex(p => p.id === state.currentProject!.id);
      
      const updatedProject = {
        ...state.currentProject,
        updated: new Date()
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = updatedProject;
      } else {
        projects.push(updatedProject);
      }

      storageService.saveData('projects', projects);
      dispatch({ type: 'UPDATE_PROJECT', payload: { updated: new Date() } });
      
      toast.success('Project saved successfully');
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save project');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [state.currentProject, dispatch]);

  const addScene = useCallback(async (title: string, description?: string) => {
    const newScene: GameScene = {
      id: `scene_${Date.now()}`,
      title: title || 'New Scene',
      description: description || 'A new scene in your adventure.',
      choices: []
    };

    dispatch({ type: 'ADD_SCENE', payload: newScene });
    toast.success('Scene added successfully');
    return newScene;
  }, [dispatch]);

  const updateScene = useCallback((sceneId: string, updates: Partial<GameScene>) => {
    if (!state.currentProject) return;

    const scene = state.currentProject.scenes.find(s => s.id === sceneId);
    if (!scene) {
      toast.error('Scene not found');
      return;
    }

    const updatedScene = { ...scene, ...updates };
    dispatch({ type: 'UPDATE_SCENE', payload: updatedScene });
  }, [state.currentProject, dispatch]);

  const addChoice = useCallback((sceneId: string, choiceText: string) => {
    if (!state.currentProject) return;

    const scene = state.currentProject.scenes.find(s => s.id === sceneId);
    if (!scene) {
      toast.error('Scene not found');
      return;
    }

    const newChoice: Choice = {
      id: `choice_${Date.now()}`,
      text: choiceText,
      nextSceneId: ''
    };

    const updatedScene = {
      ...scene,
      choices: [...scene.choices, newChoice]
    };

    dispatch({ type: 'UPDATE_SCENE', payload: updatedScene });
    toast.success('Choice added successfully');
  }, [state.currentProject, dispatch]);

  const generateSceneWithAI = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    try {
      const sceneData = await geminiService.generateGameContent('scene', prompt);
      const newScene = await addScene(sceneData.title, sceneData.description);
      
      if (newScene && sceneData.choices) {
        const updatedScene = {
          ...newScene,
          choices: sceneData.choices
        };
        dispatch({ type: 'UPDATE_SCENE', payload: updatedScene });
      }
      
      toast.success('AI scene generated successfully');
      return newScene;
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error('Failed to generate scene with AI');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [addScene, dispatch]);

  const testGame = useCallback(() => {
    if (!state.currentProject || state.currentProject.scenes.length === 0) {
      toast.error('No scenes to test');
      return;
    }

    // In a real implementation, this would open a game runner
    toast.success('Game test mode activated');
  }, [state.currentProject]);

  const exportProject = useCallback((format: 'json' | 'html' | 'twine') => {
    if (!state.currentProject) {
      toast.error('No project to export');
      return;
    }

    try {
      let exportData: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          exportData = JSON.stringify(state.currentProject, null, 2);
          filename = `${state.currentProject.name}.json`;
          mimeType = 'application/json';
          break;
        
        case 'html':
          exportData = generateHTMLExport(state.currentProject);
          filename = `${state.currentProject.name}.html`;
          mimeType = 'text/html';
          break;
        
        case 'twine':
          exportData = generateTwineExport(state.currentProject);
          filename = `${state.currentProject.name}.tw2`;
          mimeType = 'text/plain';
          break;
        
        default:
          throw new Error('Unsupported export format');
      }

      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Project exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export project');
    }
  }, [state.currentProject]);

  return {
    isGenerating,
    isSaving,
    saveProject,
    addScene,
    updateScene,
    addChoice,
    generateSceneWithAI,
    testGame,
    exportProject
  };
}

function generateHTMLExport(project: GameProject): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .scene { margin-bottom: 30px; }
        .choices { margin-top: 20px; }
        .choice { display: block; margin: 10px 0; padding: 10px; background: #f0f0f0; border: none; cursor: pointer; }
        .choice:hover { background: #e0e0e0; }
    </style>
</head>
<body>
    <h1>${project.name}</h1>
    <p>${project.description}</p>
    <div id="game-content"></div>
    <script>
        const scenes = ${JSON.stringify(project.scenes)};
        let currentSceneId = '${project.scenes[0]?.id || ''}';
        
        function showScene(sceneId) {
            const scene = scenes.find(s => s.id === sceneId);
            if (!scene) return;
            
            const content = document.getElementById('game-content');
            content.innerHTML = \`
                <div class="scene">
                    <h2>\${scene.title}</h2>
                    <p>\${scene.description}</p>
                    <div class="choices">
                        \${scene.choices.map(choice => 
                            \`<button class="choice" onclick="showScene('\${choice.nextSceneId}')">\${choice.text}</button>\`
                        ).join('')}
                    </div>
                </div>
            \`;
        }
        
        showScene(currentSceneId);
    </script>
</body>
</html>`;
}

function generateTwineExport(project: GameProject): string {
  let twineContent = `:: Start\n${project.description}\n\n`;
  
  project.scenes.forEach(scene => {
    twineContent += `:: ${scene.title}\n${scene.description}\n\n`;
    scene.choices.forEach(choice => {
      const nextScene = project.scenes.find(s => s.id === choice.nextSceneId);
      const nextTitle = nextScene ? nextScene.title : 'End';
      twineContent += `[[${choice.text}|${nextTitle}]]\n`;
    });
    twineContent += '\n';
  });
  
  return twineContent;
}