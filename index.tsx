
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppTab } from './types';
import { askMentor } from './geminiService';

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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-100/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-200/50 rounded-full blur-[120px]"></div>
      </div>

      <main className="flex-1 relative z-10 pb-28">
        {renderContent()}
      </main>

      {/* Elegant Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
        <div className="max-w-md mx-auto h-20 glass-nav border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] flex justify-around items-center px-4 pointer-events-auto">
          <NavBtn 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} 
            label="Início" 
            active={activeTab === 'home'} 
            onClick={() => navigateTo('home')} 
          />
          <NavBtn 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>} 
            label="Estudos" 
            active={activeTab === 'estudos'} 
            onClick={() => navigateTo('estudos')} 
          />
          
          <button 
            onClick={() => setShowMentor(true)}
            className="w-14 h-14 bg-stone-900 rounded-2xl shadow-xl flex items-center justify-center text-amber-500 active:scale-90 transition-all border border-stone-800"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </button>

          <NavBtn 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} 
            label="Quiz" 
            active={activeTab === 'quiz'} 
            onClick={() => navigateTo('quiz')} 
          />
          <NavBtn 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5"/><path d="M10 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5"/><path d="M14 11h-4v4a2 2 0 0 0 4 0v-4Z"/><path d="M6 11h12"/><path d="M12 21v-4"/></svg>} 
            label="Orações" 
            active={activeTab === 'oracao'} 
            onClick={() => navigateTo('oracao')} 
          />
        </div>
      </div>

      {showMentor && (
        <MentorDrawer onClose={() => setShowMentor(false)} />
      )}
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-amber-700' : 'text-stone-400'}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);

const MentorDrawer = ({ onClose }: { onClose: () => void }) => {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!q) return;
    setLoading(true);
    const res = await askMentor(q);
    setAns(res || 'Refletindo...');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-white/50 animate-in slide-in-from-bottom-full duration-500 ease-out">
        <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-8"></div>
        
        <div className="flex justify-between items-center mb-8">
           <div>
             <h3 className="text-xl font-bold text-stone-800">Guia Espiritual</h3>
             <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">SABEDORIA COM IA</p>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center border border-stone-100">✕</button>
        </div>
        
        <div className="max-h-[40vh] overflow-y-auto no-scrollbar mb-8 text-stone-600 leading-relaxed text-sm whitespace-pre-wrap font-serif">
          {ans || "Como posso iluminar sua jornada com a Palavra de Deus hoje?"}
          {loading && <div className="mt-4 flex gap-1"><div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></div></div>}
        </div>

        <div className="flex gap-3 items-center bg-stone-50 border border-stone-100 p-2 rounded-3xl">
          <input 
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium text-stone-800 placeholder:text-stone-300"
            placeholder="O que inquieta seu coração?"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk} 
            className="w-12 h-12 bg-stone-900 text-amber-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
