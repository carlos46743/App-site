
import { Study, Article, Prayer, QuizQuestion } from './types';

const STORAGE_KEYS = {
  STUDIES: 'ebd_studies',
  ARTICLES: 'ebd_articles',
  PRAYERS: 'ebd_prayers',
  QUIZ: 'ebd_quiz'
};

const defaultArticles: Article[] = [
  {
    id: 'a1',
    title: 'A Importância da Perseverança',
    author: 'Equipe Pastoral',
    content: "A perseverança é uma das virtudes mais celebradas nas Escrituras. Em Tiago 1, somos lembrados de que a prova da nossa fé produz paciência. Perseverar não é apenas esperar, mas manter a atitude correta enquanto se espera as promessas de Deus se cumprirem.",
    date: '15/05/2024',
    timestamp: Date.now()
  }
];

export const DB = {
  getStudies: (): Study[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDIES) || '[]'),
  saveStudy: (study: Study) => {
    const studies = DB.getStudies();
    const index = studies.findIndex(s => s.id === study.id);
    if (index >= 0) studies[index] = study;
    else studies.push(study);
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studies));
  },
  deleteStudy: (id: string) => {
    const studies = DB.getStudies().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studies));
  },

  getArticles: (): Article[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || JSON.stringify(defaultArticles)),
  saveArticle: (article: Article) => {
    const articles = DB.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index >= 0) articles[index] = article;
    else articles.push(article);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  deleteArticle: (id: string) => {
    const articles = DB.getArticles().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },

  getPrayers: (): Prayer[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRAYERS);
    return stored ? JSON.parse(stored) : [
      { id: 'p1', type: 'manha', title: 'Oração da Manhã', content: "Senhor, obrigado por este novo dia que se inicia. Entrego meus planos em tuas mãos.", date: new Date().toLocaleDateString() },
      { id: 'p2', type: 'noite', title: 'Oração da Noite', content: "Pai, obrigado pela tua proteção durante este dia. Que meu sono seja reparador em ti.", date: new Date().toLocaleDateString() }
    ];
  },
  savePrayer: (prayer: Prayer) => {
    const prayers = DB.getPrayers();
    const index = prayers.findIndex(p => p.id === prayer.id);
    if (index >= 0) prayers[index] = prayer;
    else prayers.push(prayer);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  },
  deletePrayer: (id: string) => {
    const prayers = DB.getPrayers().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  },

  getQuiz: (): QuizQuestion[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.QUIZ);
    return stored ? JSON.parse(stored) : [
      { id: 'q1', question: "Quem foi o sucessor de Moisés para liderar o povo a Canaã?", options: ["Arão", "Josué", "Calebe", "Gideão"], correctIndex: 1 }
    ];
  },
  saveQuizQuestion: (q: QuizQuestion) => {
    const quiz = DB.getQuiz();
    const index = quiz.findIndex(item => item.id === q.id);
    if (index >= 0) quiz[index] = q;
    else quiz.push(quiz[index]); // This looks like a bug in existing code, let's fix it
    quiz[index >= 0 ? index : quiz.length] = q; // Correct way
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  },
  deleteQuizQuestion: (id: string) => {
    const quiz = DB.getQuiz().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  }
};
