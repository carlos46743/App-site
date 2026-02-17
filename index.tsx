
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
    <div className="min-h-screen bg-stone-50 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-200 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-stone-300 rounded-full blur-[100px]"></div>
      </div>

      <main className="flex-1 relative z-10 pb-28">
        {renderContent()}
      </main>

      {/* Android Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-stone-200/50 safe-bottom">
        <div className="max-w-md mx-auto h-20 flex justify-around items-center px-6">
          <NavBtn icon="🏠" label="Home" active={activeTab === 'home'} onClick={() => navigateTo('home')} />
          <NavBtn icon="📖" label="Estudos" active={activeTab === 'estudos'} onClick={() => navigateTo('estudos')} />
          
          {/* Central Mentor FAB Style */}
          <button 
            onClick={() => setShowMentor(true)}
            className="w-16 h-16 -translate-y-8 bg-stone-900 rounded-3xl shadow-2xl flex items-center justify-center text-white text-2xl active:scale-90 transition-all border-[6px] border-stone-50"
          >
            ✨
          </button>

          <NavBtn icon="💡" label="Quiz" active={activeTab === 'quiz'} onClick={() => navigateTo('quiz')} />
          <NavBtn icon="🙏" label="Orações" active={activeTab === 'oracao'} onClick={() => navigateTo('oracao')} />
        </div>
        {/* Android Gesture Indicator Bar */}
        <div className="h-1.5 w-32 bg-stone-300 rounded-full mx-auto mb-2 opacity-50"></div>
      </div>

      {/* Mentor Chat Drawer Style */}
      {showMentor && (
        <MentorDrawer onClose={() => setShowMentor(false)} />
      )}
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300 ${active ? 'text-amber-700' : 'text-stone-400'}`}
  >
    <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-amber-100' : 'bg-transparent'}`}>
      <span className="text-xl">{icon}</span>
    </div>
    <span className={`text-[11px] font-bold tracking-tight ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
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
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl p-8 border-t border-stone-100 animate-in slide-in-from-bottom-full duration-300 ease-out">
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-stone-800">Mentor de Fé IA</h3>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center">✕</button>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto no-scrollbar mb-6 text-stone-600 leading-relaxed text-sm whitespace-pre-wrap">
          {ans || "Como posso iluminar seu dia com a Palavra?"}
          {loading && <div className="mt-4 flex gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-150"></div></div>}
        </div>

        <div className="flex gap-2 items-center bg-stone-100 p-2 rounded-2xl">
          <input 
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium"
            placeholder="Digite sua dúvida bíblica..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk} 
            className="w-12 h-12 bg-stone-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            ↑
          </button>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
