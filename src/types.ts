
export enum Grade {
  G1 = 1,
  G2 = 2,
  G3 = 3,
  G4 = 4,
  G5 = 5,
  G6 = 6
}

export enum Category {
  PHONETICS = "語音",
  CHARACTERS = "識字與寫字",
  VOCABULARY = "詞彙與語法",
  READING = "閱讀理解",
  WRITING = "寫作表達"
}

export type QuestionType = 'audio' | 'stroke' | 'matching' | 'cloze' | 'standard';

export interface Question {
  id: string;
  type: QuestionType;
  text: string; // For cloze: "我今天___去上學", for audio: "請聽音辨字"
  options: string[];
  correctAnswer: number | string | string[]; // Can be index, string, or array of pairs
  explanation: string;
  // Category specific fields
  audioText?: string; // Text to be spoken by AI
  character?: string; // For stroke order
  bopomofo?: string;
  definition?: string;
  exampleSentence?: string;
  matchingPairs?: { left: string; right: string }[];
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface GameState {
  playerName: string;
  currentGrade: Grade;
  energyPoints: number;
  rubies: number;
  emeralds: number;
  sapphires: number;
  diamonds: number;
  energyPacks: number;
  unlockedGrades: Grade[];
  completedBosses: string[];
}

export const INITIAL_STATE: GameState = {
  playerName: "",
  currentGrade: Grade.G1,
  energyPoints: 0,
  rubies: 0,
  emeralds: 0,
  sapphires: 0,
  diamonds: 0,
  energyPacks: 0,
  unlockedGrades: [Grade.G1],
  completedBosses: []
};
