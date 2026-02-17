
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import Home from './pages/Home';
import Studies from './pages/Studies';
import Quiz from './pages/Quiz';
import PrayerPage from './pages/Prayer';
import Articles from './pages/Articles';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Handle back button behavior for the custom SPA navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppTab;
      if (['home', 'estudos', 'quiz', 'oracao', 'artigos', 'admin'].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: AppTab) => {
    window.location.hash = tab;
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={navigateTo} />;
      case 'estudos': return <Studies onBack={() => navigateTo('home')} />;
      case 'quiz': return <Quiz onBack={() => navigateTo('home')} />;
      case 'oracao': return <PrayerPage onBack={() => navigateTo('home')} />;
      case 'artigos': return <Articles onBack={() => navigateTo('home')} />;
      case 'admin': return <Admin onBack={() => navigateTo('home')} />;
      default: return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-stone-50 shadow-2xl overflow-x-hidden relative">
      <main className="flex-1 pb-20">
        {renderContent()}
      </main>

      {/* Persistent Navigation Bar for Home View */}
      {activeTab === 'home' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-stone-200 py-3 px-6 flex justify-around items-center z-50">
          <button onClick={() => navigateTo('home')} className="flex flex-col items-center text-stone-400 hover:text-amber-600 transition">
             <span className="text-xl">🏠</span>
             <span className="text-[10px] font-medium mt-1">Início</span>
          </button>
          <button onClick={() => navigateTo('admin')} className="flex flex-col items-center text-stone-400 hover:text-amber-600 transition">
             <span className="text-xl">⚙️</span>
             <span className="text-[10px] font-medium mt-1">Admin</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
