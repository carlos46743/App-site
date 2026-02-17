
import React, { useState, useEffect } from 'react';
import { AppTab } from '../types';
import { DB } from '../db';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [dailyVerse, setDailyVerse] = useState({ text: "", ref: "" });

  useEffect(() => {
    const verses = DB.getVerses();
    const random = verses[Math.floor(Math.random() * verses.length)];
    setDailyVerse(random);
  }, []);

  return (
    <div className="animate-in fade-in duration-700 pb-10">
      <header className="px-8 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-[2px] bg-amber-500 rounded-full"></div>
          <span className="text-[10px] font-black tracking-[0.5em] text-stone-400 uppercase">ESSÊNCIA DIÁRIA</span>
        </div>
        <h1 className="text-5xl font-bold text-stone-900 tracking-tight font-serif leading-[1.1]">
          Sabedoria para o <br/><span className="text-amber-600">seu caminho</span>.
        </h1>
      </header>

      <div className="px-6 space-y-10">
        <div className="relative group overflow-hidden rounded-[48px] bg-stone-900 p-12 shadow-2xl transition-all active:scale-[0.98] border border-stone-800">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Background" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-6">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-500"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
               <span className="text-[9px] font-black text-amber-500 tracking-[0.4em] uppercase">LUZ DA MANHÃ</span>
             </div>
             <p className="font-serif text-2xl text-white/95 leading-relaxed mb-8 italic">
              "{dailyVerse.text}"
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">{dailyVerse.ref}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <LargeMenuCard 
            title="Jornada de 7 Dias"
            subtitle="O ciclo completo de renovação espiritual"
            image="https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=800"
            onClick={() => onNavigate('estudos')}
            accent="bg-amber-600"
          />
          
          <div className="grid grid-cols-2 gap-6">
             <SmallMenuCard 
                title="Desafio"
                subtitle="Quiz Bíblico"
                image="https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&q=80&w=400"
                onClick={() => onNavigate('quiz')}
             />
             <SmallMenuCard 
                title="Momento"
                subtitle="Orações"
                image="https://images.unsplash.com/photo-1490730141103-6ac27d02047f?auto=format&fit=crop&q=80&w=400"
                onClick={() => onNavigate('oracao')}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const LargeMenuCard = ({ title, subtitle, image, onClick, accent }: any) => (
  <button onClick={onClick} className="relative w-full h-72 rounded-[48px] overflow-hidden shadow-lg group transition-all active:scale-95 text-left border border-white">
    <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={title} />
    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
    <div className="absolute bottom-10 left-10 right-10">
      <div className={`inline-block px-4 py-1.5 rounded-full ${accent} text-white text-[9px] font-black uppercase tracking-widest mb-4`}>COMECAR</div>
      <h3 className="text-3xl font-bold text-white mb-2 font-serif">{title}</h3>
      <p className="text-white/60 text-xs font-medium tracking-tight">{subtitle}</p>
    </div>
  </button>
);

const SmallMenuCard = ({ title, subtitle, image, onClick }: any) => (
  <button onClick={onClick} className="relative h-56 rounded-[48px] overflow-hidden shadow-md group transition-all active:scale-95 text-left border border-white">
    <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
    <div className="absolute inset-0 bg-stone-900/30"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 to-transparent"></div>
    <div className="absolute inset-0 flex flex-col p-8">
      <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">{title}</span>
      <h3 className="text-white font-bold tracking-tight text-xl font-serif">{subtitle}</h3>
    </div>
  </button>
);

export default Home;
