
import React from 'react';
import { AppTab } from '../types';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="px-8 py-12">
        <span className="text-[10px] font-black tracking-[0.3em] text-amber-600/60 uppercase mb-2 block">DEVOCIONAL DIÁRIO</span>
        <h1 className="text-4xl font-bold text-stone-800 tracking-tight font-serif leading-none">Pão Vivo</h1>
      </header>

      <div className="px-6 space-y-6">
        {/* Versículo de Destaque Android Style */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full opacity-50"></div>
          <p className="font-serif text-2xl text-stone-800 leading-tight mb-6 italic relative z-10">
            "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-6 bg-amber-200"></div>
            <span className="text-amber-700 font-bold text-xs tracking-wider">SALMOS 119:105</span>
          </div>
        </div>

        {/* Menu Grid - Android Cards */}
        <div className="grid grid-cols-2 gap-4">
          <MenuButton 
            title="Estudos" 
            desc="Mergulhe na Palavra" 
            icon="📖" 
            bg="bg-stone-800" 
            text="text-white"
            onClick={() => onNavigate('estudos')} 
          />
          <MenuButton 
            title="Quiz" 
            desc="Teste seu saber" 
            icon="💡" 
            bg="bg-amber-100" 
            text="text-stone-800"
            onClick={() => onNavigate('quiz')} 
          />
          <MenuButton 
            title="Orações" 
            desc="Fale com Deus" 
            icon="🙏" 
            bg="bg-white" 
            text="text-stone-800"
            border="border-stone-100 shadow-sm"
            onClick={() => onNavigate('oracao')} 
          />
          <MenuButton 
            title="Artigos" 
            desc="Reflexões" 
            icon="✒️" 
            bg="bg-stone-100" 
            text="text-stone-800"
            onClick={() => onNavigate('artigos')} 
          />
        </div>
      </div>

      <footer className="mt-16 mb-8 text-center">
         <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">© 2026 Missão Pão Vivo</p>
      </footer>
    </div>
  );
};

const MenuButton = ({ title, desc, icon, bg, text, border, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`${bg} ${text} ${border || ''} p-6 rounded-[32px] flex flex-col items-start gap-4 transition-all active:scale-95 text-left`}
  >
    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-base leading-none mb-1">{title}</h3>
      <p className="text-[10px] opacity-60 font-medium uppercase tracking-tighter">{desc}</p>
    </div>
  </button>
);

export default Home;
