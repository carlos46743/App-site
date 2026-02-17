
export interface Study {
  id: string;
  title: string;
  verse: string;
  explanation: string;
  application: string;
  prayer: string;
  date: string;
  image?: string;
  timestamp: number;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  image?: string;
  timestamp: number;
}

export interface Prayer {
  id: string;
  type: 'manha' | 'noite' | 'personalizada';
  title: string;
  content: string;
  date: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export type AppTab = 'home' | 'estudos' | 'quiz' | 'oracao' | 'artigos';
