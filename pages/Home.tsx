
import React, { useState } from 'react';
import { AppTab } from '../types';
import { askMentor } from '../geminiService';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    const res = await askMentor(question);
    setAnswer(res || '');
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-10">
      <header className="px-6 py-12 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-[30px] flex items-center justify-center mx-auto mb-4 shadow-inner">
           <span className="text-4xl">🕊️</span>
        </div>
        <h1 className="text-4xl font-bold text-stone-800 tracking-tight font-serif">Pão Diário</h1>
        <p className="text-stone-400 text-sm mt-2 font-medium tracking-wide">SABEDORIA QUE TRANSFORMA</p>
      </header>

      <div className="px-6 space-y-8">
        {/* Versículo Principal */}
        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-stone-200/50 border border-stone-100 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-8xl font-serif">"</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-bold mb-6 block">MEDITAÇÃO DE HOJE</span>
          <p className="font-serif text-2xl text-stone-800 leading-snug mb-6 italic">
            "Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas."
          </p>
          <div className="inline-flex items-center gap-3 bg-stone-50 px-6 py-2 rounded-full">
            <span className="text-stone-700 font-bold text-sm italic">Mateus 6:33</span>
          </div>
        </div>

        {/* Grid de Navegação Principal */}
        <nav className="grid grid-cols-2 gap-4">
          <MenuCard title="Estudos" icon="📖" color="bg-stone-800" text="white" onClick={() => onNavigate('estudos')} />
          <MenuCard title="Quiz" icon="💡" color="bg-amber-100" text="stone-800" onClick={() => onNavigate('quiz')} />
          <MenuCard title="Orações" icon="🙏" color="bg-stone-100" text="stone-800" onClick={() => onNavigate('oracao')} />
          <MenuCard title="Artigos" icon="✒️" color="bg-stone-50" text="stone-800" border="border-stone-200" onClick={() => onNavigate('artigos')} />
        </nav>
      </div>

      {/* Assistente IA Flutuante */}
      <div className="fixed bottom-24 right-6 z-[60]">
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="w-16 h-16 bg-amber-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition active:scale-95"
        >
          {chatOpen ? '✕' : '✨'}
        </button>

        {chatOpen && (
          <div className="absolute bottom-20 right-0 w-[320px] bg-white rounded-[32px] shadow-2xl border border-stone-100 p-6 animate-in slide-in-from-bottom-4">
             <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <span>✨</span> Mentor Bíblico IA
             </h3>
             <div className="max-h-[300px] overflow-y-auto no-scrollbar mb-4 text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                {answer ? answer : "Olá! Qual sua dúvida bíblica hoje?"}
                {loading && <p className="animate-pulse">Pensando...</p>}
             </div>
             <div className="flex gap-2">
                <input 
                  className="flex-1 bg-stone-50 border border-stone-100 rounded-full px-4 py-2 text-sm focus:outline-amber-600"
                  placeholder="Pergunte algo..."
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAsk()}
                />
                <button onClick={handleAsk} className="w-10 h-10 bg-stone-800 text-white rounded-full flex items-center justify-center">↑</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuCard = ({ title, icon, color, text, border, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`${color} ${border || ''} p-8 rounded-[35px] flex flex-col items-center gap-3 transition hover:shadow-lg active:scale-95`}
  >
    <span className="text-3xl">{icon}</span>
    <span className={`font-bold text-${text} tracking-tight`}>{title}</span>
  </button>
);

export default Home;
