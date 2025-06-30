import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameProject, GameScene, Character, Item } from '../types/game';

interface GameState {
  currentProject: GameProject | null;
  projects: GameProject[];
  isLoading: boolean;
  error: string | null;
}

type GameAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: GameProject }
  | { type: 'ADD_PROJECT'; payload: GameProject }
  | { type: 'UPDATE_PROJECT'; payload: Partial<GameProject> }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_SCENE'; payload: GameScene }
  | { type: 'UPDATE_SCENE'; payload: GameScene }
  | { type: 'DELETE_SCENE'; payload: string }
  | { type: 'ADD_CHARACTER'; payload: Character }
  | { type: 'UPDATE_CHARACTER'; payload: Character }
  | { type: 'DELETE_CHARACTER'; payload: string }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: GameState = {
  currentProject: null,
  projects: [],
  isLoading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    
    case 'ADD_PROJECT':
      return { 
        ...state, 
        projects: [...state.projects, action.payload],
        currentProject: action.payload
      };
    
    case 'UPDATE_PROJECT':
      const updatedProject = { ...state.currentProject!, ...action.payload };
      return {
        ...state,
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        )
      };
    
    case 'ADD_SCENE':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          scenes: [...state.currentProject.scenes, action.payload]
        }
      };
    
    case 'UPDATE_SCENE':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          scenes: state.currentProject.scenes.map(s =>
            s.id === action.payload.id ? action.payload : s
          )
        }
      };
    
    case 'ADD_CHARACTER':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          characters: [...state.currentProject.characters, action.payload]
        }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}