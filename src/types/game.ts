export interface Character {
  id: string;
  name: string;
  description: string;
  attributes: {
    health: number;
    strength: number;
    intelligence: number;
    agility: number;
  };
  portrait?: string;
  backstory: string;
}

export interface GameScene {
  id: string;
  title: string;
  description: string;
  image?: string;
  choices: Choice[];
  conditions?: Condition[];
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requirements?: Requirement[];
  consequences?: Consequence[];
}

export interface Condition {
  type: 'item' | 'attribute' | 'flag';
  key: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: any;
}

export interface Requirement {
  type: 'item' | 'attribute' | 'skill';
  key: string;
  value: number;
}

export interface Consequence {
  type: 'item' | 'attribute' | 'flag';
  key: string;
  value: any;
  operation: 'add' | 'remove' | 'set';
}

export interface GameProject {
  id: string;
  name: string;
  description: string;
  genre: string;
  created: Date;
  updated: Date;
  scenes: GameScene[];
  characters: Character[];
  items: Item[];
  variables: { [key: string]: any };
  settings: GameSettings;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'misc';
  image?: string;
  properties: { [key: string]: any };
}

export interface GameSettings {
  theme: 'dark' | 'light' | 'fantasy' | 'scifi';
  difficulty: 'easy' | 'normal' | 'hard';
  enableSaving: boolean;
  enableMusic: boolean;
  enableVoice: boolean;
}