
export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  color: string;
  size: number;
}

// Define the HolidayGreeting interface for AI generated content
export interface HolidayGreeting {
  message: string;
  sender: string;
}
