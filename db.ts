
import { Study, Article, Prayer, QuizQuestion, PrayerRequest, Comment } from './types';

const STORAGE_KEYS = {
  STUDIES: 'ebd_studies',
  ARTICLES: 'ebd_articles',
  PRAYERS: 'ebd_prayers',
  QUIZ: 'ebd_quiz',
  COMMUNITY_PRAYERS: 'ebd_community_prayers'
};

const defaultStudies: Study[] = [
  {
    id: '1',
    title: 'O Poder da Fé',
    verse: 'Ora, a fé é a certeza daquilo que esperamos.',
    explanation: 'A fé não é apenas acreditar, é confiar plenamente na soberania de Deus mesmo quando não vemos o caminho.',
    application: 'Tire 5 minutos hoje para entregar a Deus sua maior preocupação.',
    prayer: 'Senhor, aumenta a minha fé...',
    date: 'Dia 1',
    image: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now()
  },
  {
    id: '2',
    title: 'A Graça Redentora',
    verse: 'Pela graça sois salvos, por meio da fé.',
    explanation: 'A graça é um presente imerecido. Não trabalhamos para obtê-la; nós a recebemos através de Cristo.',
    application: 'Perdoe alguém hoje, assim como você foi perdoado pela graça.',
    prayer: 'Pai, obrigado por Teu amor sem limites...',
    date: 'Dia 2',
    image: 'https://images.unsplash.com/photo-1490730141103-6ac27d020028?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now()
  },
  {
    id: '3',
    title: 'Caminhando em Luz',
    verse: 'Tua palavra é lâmpada para os meus pés.',
    explanation: 'Em um mundo escuro, a Bíblia serve como o guia que revela os perigos e o caminho seguro.',
    application: 'Leia um capítulo de Provérbios antes de tomar uma decisão importante.',
    prayer: 'Espírito Santo, ilumina meu entendimento...',
    date: 'Dia 3',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now()
  },
  {
    id: '4',
    title: 'O Amor ao Próximo',
    verse: 'Amai-vos uns aos outros como eu vos amei.',
    explanation: 'O amor cristão é ação, não apenas sentimento. É colocar a necessidade do outro acima da nossa.',
    application: 'Faça um gesto de bondade anônimo hoje.',
    prayer: 'Senhor, ensina-me a amar de verdade...',
    date: 'Dia 4',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now()
  }
];

export const verses = [
  { text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", ref: "Salmos 119:105" },
  { text: "O Senhor é o meu pastor, nada me faltará.", ref: "Salmos 23:1" },
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" }
];

export const DB = {
  getVerses: () => verses,
  getCommunityPrayers: (): PrayerRequest[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY_PRAYERS);
    return stored ? JSON.parse(stored) : [];
  },
  saveCommunityPrayer: (request: PrayerRequest) => {
    const requests = DB.getCommunityPrayers();
    requests.unshift(request);
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
    const studies = stored ? JSON.parse(stored) : [];
    return studies.length > 0 ? studies : defaultStudies;
  },
  saveStudy: (study: Study) => {
    const studies = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDIES) || '[]');
    studies.push(study);
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
  getQuiz: (): QuizQuestion[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.QUIZ);
    return stored ? JSON.parse(stored) : [];
  },
  saveQuizQuestion: (question: QuizQuestion) => {
    const quiz = DB.getQuiz();
    quiz.push(question);
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
  deleteStudy: (id: string) => {
    const studies = DB.getStudies().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studies));
  },
  deleteArticle: (id: string) => {
    const articles = DB.getArticles().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  deleteQuizQuestion: (id: string) => {
    const quiz = DB.getQuiz().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  },
  deletePrayer: (id: string) => {
    const prayers = DB.getPrayers().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  }
};
