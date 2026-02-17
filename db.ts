
import { Study, Article, Prayer, QuizQuestion } from './types';

const STORAGE_KEYS = {
  STUDIES: 'ebd_studies',
  ARTICLES: 'ebd_articles',
  PRAYERS: 'ebd_prayers',
  QUIZ: 'ebd_quiz'
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

const defaultStudies: Study[] = [
  {
    id: 'd1',
    title: 'Dia 1: O Início da Jornada',
    verse: 'No princípio era o Verbo, e o Verbo estava com Deus.',
    explanation: 'Tudo começa com a Palavra. Para construir uma vida sólida, precisamos entender que a base de toda a criação e da nossa existência é o Logos divino.',
    application: 'Dedique 5 minutos hoje para o silêncio e ouça a voz de Deus.',
    prayer: 'Senhor, ajuda-me a priorizar Tua voz acima de todos os ruídos.',
    date: 'Dia 1',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now()
  },
  {
    id: 'd2',
    title: 'Dia 2: A Rocha Firme',
    verse: 'Todo aquele que ouve estas minhas palavras e as pratica será semelhante ao homem prudente.',
    explanation: 'Construir sobre a areia é fácil, mas construir sobre a Rocha exige esforço e obediência constante às escrituras.',
    application: 'Identifique uma decisão difícil e peça direção bíblica para ela.',
    prayer: 'Pai, firma meus pés em Tua verdade.',
    date: 'Dia 2',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now() + 1
  },
  {
    id: 'd3',
    title: 'Dia 3: A Luz no Caminho',
    verse: 'Vós sois a luz do mundo. Não se pode esconder uma cidade edificada sobre um monte.',
    explanation: 'Nossa fé não é apenas para nós mesmos. Ela deve brilhar para que outros vejam a glória de Deus através de nossas ações.',
    application: 'Faça um gesto de bondade para alguém que não espera hoje.',
    prayer: 'Senhor, que minha vida reflita Tua luz.',
    date: 'Dia 3',
    image: 'https://images.unsplash.com/photo-1443926818681-717d074a5baf?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now() + 2
  },
  {
    id: 'd4',
    title: 'Dia 4: O Poder da Oração',
    verse: 'Orai sem cessar.',
    explanation: 'A oração é o oxigênio da alma. Sem comunicação constante com o Criador, perdemos o ritmo da nossa caminhada espiritual.',
    application: 'Transforme seus pensamentos de preocupação em breves orações hoje.',
    prayer: 'Deus, ensina-me a manter um diálogo contínuo contigo.',
    date: 'Dia 4',
    image: 'https://images.unsplash.com/photo-1490730141103-6ac27d02047f?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now() + 3
  },
  {
    id: 'd5',
    title: 'Dia 5: O Fruto do Espírito',
    verse: 'Mas o fruto do Espírito é: amor, alegria, paz, longanimidade...',
    explanation: 'O caráter cristão é moldado de dentro para fora. O Espírito Santo produz em nós o que não conseguimos sozinhos.',
    application: 'Escolha um dos frutos e foque em exercitá-lo intencionalmente.',
    prayer: 'Espírito Santo, molda meu caráter segundo o Teu.',
    date: 'Dia 5',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now() + 4
  },
  {
    id: 'd6',
    title: 'Dia 6: A Armadura de Deus',
    verse: 'Revesti-vos de toda a armadura de Deus.',
    explanation: 'Estamos em uma batalha espiritual. A verdade, a justiça e a fé são proteções indispensáveis contra o desânimo.',
    application: 'Leia Efésios 6 e identifique sua peça da armadura mais fraca.',
    prayer: 'Senhor, protege minha mente e meu coração hoje.',
    date: 'Dia 6',
    image: 'https://images.unsplash.com/photo-1519074063231-4349470b59b3?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now() + 5
  },
  {
    id: 'd7',
    title: 'Dia 7: O Descanso em Deus',
    verse: 'Vinde a mim, todos os que estais cansados, e eu vos aliviarei.',
    explanation: 'A jornada termina onde tudo começou: na confiança plena no descanso que só Cristo pode oferecer após a labuta.',
    application: 'Desligue as telas por uma hora e apenas descanse na presença de Deus.',
    prayer: 'Pai, eu descanso em Ti. Obrigado por me sustentar nesta jornada.',
    date: 'Dia 7',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    timestamp: Date.now() + 6
  }
];

export const DB = {
  getVerses: () => verses,
  getStudies: (): Study[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDIES);
    return stored ? JSON.parse(stored) : defaultStudies;
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
    return stored ? JSON.parse(stored) : [
      {
        id: 'a1',
        title: 'Como ler a Bíblia e entender',
        author: 'Equipe Pão Diário',
        content: "Muitos sentem dificuldade em ler as escrituras. O segredo está no contexto e na oração antes da leitura...",
        date: 'Hoje',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
        timestamp: Date.now()
      }
    ];
  },
  // Added saveArticle to support manual creation in Admin
  saveArticle: (article: Article) => {
    const articles = DB.getArticles();
    articles.push(article);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  // Added deleteArticle for content management
  deleteArticle: (id: string) => {
    const articles = DB.getArticles().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  getQuiz: (): QuizQuestion[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.QUIZ);
    return stored ? JSON.parse(stored) : [
      { id: 'q1', question: "Quantos livros tem o Novo Testamento?", options: ["24", "27", "39", "66"], correctIndex: 1 }
    ];
  },
  saveQuizQuestion: (question: QuizQuestion) => {
    const quiz = DB.getQuiz();
    quiz.push(question);
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  },
  // Added deleteQuizQuestion for content management
  deleteQuizQuestion: (id: string) => {
    const quiz = DB.getQuiz().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
  },
  getPrayers: (): Prayer[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRAYERS);
    return stored ? JSON.parse(stored) : [
      { id: 'p1', type: 'manha', title: 'Manhã com Deus', content: "Senhor, abençoe meu dia.", date: 'Hoje' }
    ];
  },
  // Added savePrayer for content management
  savePrayer: (prayer: Prayer) => {
    const prayers = DB.getPrayers();
    prayers.push(prayer);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  },
  // Added deletePrayer for content management
  deletePrayer: (id: string) => {
    const prayers = DB.getPrayers().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
  }
};
