
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DB } from './db';
import { QuizQuestion } from './types';
import { generateQuizAI, generatePrayerAI } from './geminiService';

const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studies' | 'articles' | 'quiz' | 'prayers'>('studies');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    refresh();
  }, [activeTab]);

  const refresh = () => {
    if (activeTab === 'studies') setItems(DB.getStudies());
    if (activeTab === 'articles') setItems(DB.getArticles());
    if (activeTab === 'quiz') setItems(DB.getQuiz());
    if (activeTab === 'prayers') setItems(DB.getPrayers());
  };

  const deleteItem = (id: string) => {
    if (activeTab === 'studies') DB.deleteStudy(id);
    if (activeTab === 'articles') DB.deleteArticle(id);
    if (activeTab === 'quiz') DB.deleteQuizQuestion(id);
    if (activeTab === 'prayers') DB.deletePrayer(id);
    refresh();
  };

  const genQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    const res = await generateQuizAI(topic);
    if (res && Array.isArray(res)) {
      res.forEach((q: Partial<QuizQuestion>) => {
        DB.saveQuizQuestion({ 
          question: q.question || '',
          options: q.options || [],
          correctIndex: q.correctIndex ?? 0,
          id: Math.random().toString(36).substr(2, 9) 
        });
      });
      refresh();
      setTopic('');
    }
    setLoading(false);
  };

  const genPrayer = async () => {
    if (!topic) return;
    setLoading(true);
    const res = await generatePrayerAI(topic);
    if (res) {
      DB.savePrayer({
        id: Date.now().toString(),
        type: 'personalizada',
        title: `Sobre: ${topic}`,
        content: res,
        date: new Date().toLocaleDateString()
      });
      refresh();
      setTopic('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-4xl mx-auto shadow-sm">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
          <p className="text-sm text-gray-500">Gerencie sua comunidade bíblica</p>
        </div>
        <a href="index.html" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
          Ver Site Principal
        </a>
      </header>

      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <nav className="space-y-2">
          <NavItem active={activeTab === 'studies'} onClick={() => setActiveTab('studies')} label="Estudos" icon="📖" />
          <NavItem active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} label="Artigos" icon="✒️" />
          <NavItem active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} label="Quiz" icon="💡" />
          <NavItem active={activeTab === 'prayers'} onClick={() => setActiveTab('prayers')} label="Orações" icon="🙏" />
        </nav>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* AI Generation Bar */}
          <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h3 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Criação Rápida com IA</h3>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none"
                placeholder={activeTab === 'quiz' ? "Tema do Quiz (ex: Jesus e as Crianças)..." : "Tema/Sentimento (ex: Ansiedade)..."}
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
            <button 
              onClick={activeTab === 'quiz' ? genQuiz : genPrayer}
              disabled={loading || (activeTab !== 'quiz' && activeTab !== 'prayers')}
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-sm transition"
            >
              {loading ? 'Gerando...' : 'GERAR IA'}
            </button>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
               <h2 className="font-bold text-gray-700 capitalize">{activeTab}</h2>
               <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{items.length} itens</span>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto no-scrollbar">
              {items.map(item => (
                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                  <div className="min-w-0 flex-1 mr-4">
                    <h4 className="font-bold text-gray-800 text-sm truncate">
                      {item.title || item.question || item.content?.substring(0, 40) + '...'}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">{item.date || 'Registro'}</p>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition">✕</button>
                </div>
              ))}
              {items.length === 0 && <div className="p-20 text-center text-gray-300 italic">Nada por aqui ainda.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${active ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border'}`}
  >
    <span>{icon}</span> {label}
  </button>
);

const root = createRoot(document.getElementById('admin-root')!);
root.render(<AdminApp />);
