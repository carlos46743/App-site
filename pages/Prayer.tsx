
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Prayer } from '../types';

interface PrayerProps {
  onBack: () => void;
}

const PrayerPage: React.FC<PrayerProps> = ({ onBack }) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePrayerId, setActivePrayerId] = useState<string | null>(null);

  useEffect(() => {
    setPrayers(DB.getPrayers());
  }, []);

  const handleRead = (prayer: Prayer) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActivePrayerId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(prayer.content);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setActivePrayerId(prayer.id);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setActivePrayerId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 animate-in slide-in-from-bottom duration-300">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400">←</button>
        <h2 className="font-bold text-stone-800">Momento de Oração</h2>
        <div className="w-10"></div>
      </header>

      {isPlaying && (
        <div className="bg-stone-900 text-white p-5 rounded-[24px] mb-6 flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-3">
              <span className="text-xl">🔊</span>
              <span className="text-xs font-bold uppercase tracking-widest">Ouvindo Oração...</span>
           </div>
           <button onClick={() => window.speechSynthesis.cancel()} className="text-[10px] font-bold underline">PARAR</button>
        </div>
      )}

      <div className="space-y-6">
        {prayers.map(p => (
          <div key={p.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100">
             <div className="flex items-center gap-4 mb-4 border-b border-stone-50 pb-4">
                <span className="text-3xl">
                  {p.type === 'manha' ? '🌅' : p.type === 'noite' ? '🌙' : '🙏'}
                </span>
                <h3 className="font-bold text-stone-700">{p.title}</h3>
             </div>
             <div className="font-serif text-stone-600 leading-relaxed italic mb-6 whitespace-pre-wrap">
               {p.content}
             </div>
             <button 
               onClick={() => handleRead(p)}
               className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition ${activePrayerId === p.id ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
             >
                <span>{activePrayerId === p.id ? '⏸ Parar Leitura' : '🔊 Ouvir Oração'}</span>
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerPage;
