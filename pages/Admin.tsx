
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Study, Article, Prayer, QuizQuestion } from '../types';
import { generateQuizAI, generatePrayerAI } from '../geminiService';

const Admin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'studies' | 'articles' | 'quiz' | 'prayers'>('studies');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshList();
  }, [activeTab]);

  const refreshList = () => {
    if (activeTab === 'studies') setItems(DB.getStudies());
    if (activeTab === 'articles') setItems(DB.getArticles());
    if (activeTab === 'quiz') setItems(DB.getQuiz());
    if (activeTab === 'prayers') setItems(DB.getPrayers());
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'studies') DB.deleteStudy(id);
    if (activeTab === 'articles') DB.deleteArticle(id);
    if (activeTab === 'quiz') DB.deleteQuizQuestion(id);
    if (activeTab === 'prayers') DB.deletePrayer(id);
    refreshList();
  };

  // Forms logic
  const [topic, setTopic] = useState('');

  const handleGenQuiz = async () => {
    if (!topic) return alert("Digite um tema (ex: Parábolas)");
    setLoading(true);
    const qs = await generateQuizAI(topic);
    if (qs) {
      qs.forEach((q: any) => DB.saveQuizQuestion({ ...q, id: Math.random().toString(36).substr(2, 9) }));
      refreshList();
      alert("3 Questões geradas e salvas!");
    }
    setLoading(false);
  };

  const handleGenPrayer = async () => {
    if (!topic) return alert("Digite um sentimento (ex: Ansiedade)");
    setLoading(true);
    const p = await generatePrayerAI(topic);
    if (p) {
      DB.savePrayer({ 
        id: Date.now().toString(), 
        type: 'personalizada', 
        title: `Oração para: ${topic}`, 
        content: p, 
        date: new Date().toLocaleDateString() 
      });
      refreshList();
    }
    setLoading(false);
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400">←</button>
        <h2 className="font-bold text-stone-800 text-lg">Central de Conteúdo</h2>
        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs">AI</div>
      </header>

      <nav className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
        <AdminTab active={activeTab === 'studies'} onClick={() => setActiveTab('studies')} label="Estudos" />
        <AdminTab active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} label="Artigos" />
        <AdminTab active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} label="Quiz" />
        <AdminTab active={activeTab === 'prayers'} onClick={() => setActiveTab('prayers')} label="Orações" />
      </nav>

      {/* IA Assistant Bar */}
      <div className="bg-stone-900 rounded-[30px] p-6 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Assistente de Criação</h3>
          <div className="flex gap-2">
            <input 
              placeholder={activeTab === 'quiz' ? "Tema do Quiz..." : "Sentimento..."}
              className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
            <button 
              onClick={activeTab === 'quiz' ? handleGenQuiz : handleGenPrayer}
              disabled={loading}
              className="bg-amber-600 px-6 py-2 rounded-full text-xs font-bold hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? '...' : 'GERAR IA'}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-10 text-5xl">✨</div>
      </div>

      {/* Listagem de Itens */}
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-[28px] shadow-sm border border-stone-100 flex items-center justify-between group">
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-bold text-stone-800 text-sm truncate">{item.title || item.question || item.content?.substring(0, 30)}</h4>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">
                {item.date || (item.options ? 'Questão de Quiz' : 'Registro')}
              </p>
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="py-20 text-center text-stone-300 italic">
             Nenhum item cadastrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

const AdminTab = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-xs font-bold transition flex-shrink-0 ${active ? 'bg-amber-600 text-white' : 'bg-white text-stone-400 shadow-sm'}`}
  >
    {label}
  </button>
);

export default Admin;
