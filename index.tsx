
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DB } from './db';
import { AppTab, Study, Article, Prayer, QuizQuestion } from './types';
import { askMentor, getBiblicalInsight } from './geminiService';

// Componentes de Página
import Home from './pages/Home';
import Studies from './pages/Studies';
import Quiz from './pages/Quiz';
import PrayerPage from './pages/Prayer';
import Articles from './pages/Articles';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showMentor, setShowMentor] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as AppTab;
      if (['home', 'estudos', 'quiz', 'oracao', 'artigos'].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (tab: AppTab) => {
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={navigateTo} />;
      case 'estudos': return <Studies onBack={() => navigateTo('home')} />;
      case 'quiz': return <Quiz onBack={() => navigateTo('home')} />;
      case 'oracao': return <PrayerPage onBack={() => navigateTo('home')} />;
      case 'artigos': return <Articles onBack={() => navigateTo('home')} />;
      default: return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-stone-50 shadow-2xl overflow-x-hidden relative flex flex-col">
      <main className="flex-1 pb-24">
        {renderContent()}
      </main>

      {/* Navegação Inferior Estilizada */}
      {activeTab === 'home' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass border border-white/50 rounded-[35px] py-4 px-8 flex justify-around items-center z-50 card-shadow">
          <NavBtn icon="🏠" label="Início" active={activeTab === 'home'} onClick={() => navigateTo('home')} />
          <div className="w-px h-6 bg-stone-200"></div>
          <button 
            onClick={() => setShowMentor(!showMentor)}
            className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center text-white -translate-y-8 border-4 border-stone-50 shadow-xl active:scale-90 transition-all animate-float"
          >
            ✨
          </button>
          <div className="w-px h-6 bg-stone-200"></div>
          <a href="admin.html" className="flex flex-col items-center opacity-40 grayscale hover:opacity-100 transition-all">
            <span className="text-xl">⚙️</span>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Gestão</span>
          </a>
        </div>
      )}

      {/* Mentor Chat Overlay */}
      {showMentor && (
        <MentorChat onClose={() => setShowMentor(false)} />
      )}
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all ${active ? 'text-stone-900 scale-110' : 'text-stone-300 hover:text-stone-500'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold mt-1 uppercase tracking-widest">{label}</span>
  </button>
);

const MentorChat = ({ onClose }: { onClose: () => void }) => {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!q) return;
    setLoading(true);
    const res = await askMentor(q);
    setAns(res || 'Desculpe, não consegui meditar sobre isso agora.');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:pb-20">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 border border-stone-100 animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-serif text-2xl font-bold text-stone-800">✨ Mentor Bíblico</h3>
           <button onClick={onClose} className="text-stone-300 hover:text-stone-600 text-2xl">✕</button>
        </div>
        
        <div className="max-h-60 overflow-y-auto no-scrollbar mb-6 text-stone-600 leading-relaxed text-sm whitespace-pre-wrap">
          {ans || "Paz do Senhor! Como posso ajudar em seus estudos hoje? Pergunte sobre versículos, contextos ou reflexões."}
          {loading && <p className="animate-pulse text-stone-400 mt-2">Meditando na Palavra...</p>}
        </div>

        <div className="flex gap-2 bg-stone-50 p-2 rounded-full border border-stone-100">
          <input 
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
            placeholder="Qual sua dúvida bíblica?"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAsk()}
          />
          <button onClick={handleAsk} className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center">↑</button>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
