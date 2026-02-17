
import { Study, Article, Prayer, QuizQuestion, PrayerRequest, Comment } from './types';

const STORAGE_KEYS = {
  STUDIES: 'ebd_studies',
  ARTICLES: 'ebd_articles',
  PRAYERS: 'ebd_prayers',
  QUIZ: 'ebd_quiz',
  COMMUNITY_PRAYERS: 'ebd_community_prayers'
};

export const verses = [
  { text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", ref: "Salmos 119:105" },
  { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "O amor é sofredor, é benigno; o amor não é invejoso...", ref: "1 Coríntios 13:4" },
  { text: "Buscai primeiro o reino de Deus e a sua justiça.", ref: "Mateus 6:33" },
  { text: "Vinde a mim, todos os que estais cansados e oprimidos.", ref: "Mateus 11:28" },
  { text: "O temor do Senhor é o princípio da sabedoria.", ref: "Provérbios 1:7" }
];

export const DB = {
  getVerses: () => verses,
  
  getCommunityPrayers: (): PrayerRequest[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY_PRAYERS);
    return stored ? JSON.parse(stored) : [];
  },

  saveCommunityPrayer: (request: PrayerRequest) => {
    const requests = DB.getCommunityPrayers();
    requests.unshift(request); // Novos pedidos primeiro
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_PRAYERS, JSON.stringify(requests));
  },

  addAmen: (id: string) => {
    const requests = DB.getCommunityPrayers();
    const idx = requests.findIndex(r => r.id === id);
    if (idx !== -1) {
      requests[idx].amens += 1;
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_PRAYERS, JSON.stringify(requests));
    }
  },

  addComment: (prayerId: string, comment: Comment) => {
    const requests = DB.getCommunityPrayers();
    const idx = requests.findIndex(r => r.id === prayerId);
    if (idx !== -1) {
      if (!requests[idx].comments) requests[idx].comments = [];
      requests[idx].comments.push(comment);
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_PRAYERS, JSON.stringify(requests));
    }
  },

  getStudies: (): Study[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDIES);
    return stored ? JSON.parse(stored) : [];
  },
  saveStudy: (study: Study) => {
    const studies = DB.getStudies();
    studies.push(study);
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studies));
  },
  deleteStudy: (id: string) => {
    const studies = DB.getStudies().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studies));
  },
  getArticles: (): Article[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return stored ? JSON.parse(stored) : [];
  },
  saveArticle: (article: Article) => {
    const articles = DB.getArticles();
    articles.push(article);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  deleteArticle: (id: string) => {
    const articles = DB.getArticles().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  getQuiz: (): QuizQuestion[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.QUIZ);
    return stored ? JSON.parse(stored) : [];
  },
  saveQuizQuestion: (question: QuizQuestion) => {
    const quiz = DB.getQuiz();
    quiz.push(question);
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  },
  deleteQuizQuestion: (id: string) => {
    const quiz = DB.getQuiz().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  },
  getPrayers: (): Prayer[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRAYERS);
    return stored ? JSON.parse(stored) : [];
  },
  savePrayer: (prayer: Prayer) => {
    const prayers = DB.getPrayers();
    prayers.push(prayer);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  },
  deletePrayer: (id: string) => {
    const prayers = DB.getPrayers().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  }
};
