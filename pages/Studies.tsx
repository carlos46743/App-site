
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Study } from '../types';
import { getBiblicalInsight } from '../geminiService';

const Studies: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [idx, setIdx] = useState(0);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadedStudies = DB.getStudies();
    setStudies(loadedStudies.slice(0, 7));
  }, []);

  const current = studies[idx];

  const handleAI = async () => {
    if (!current) return;
    setLoading(true);
    try {
      const res = await getBiblicalInsight(current.verse, current.explanation);
      setInsight(res || null);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (studies.length === 0) return null;

  const progress = ((idx + 1) / 7) * 100;

  return (
    <div className="animate-in slide-in-from-right duration-500 min-h-screen">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl z-30">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm text-stone-400 active:scale-90 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <span className="font-black text-stone-900 text-[9px] tracking-[0.5em] uppercase block mb-1">JORNADA SAGRADA</span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Passo {idx + 1} de 7</span>
        </div>
        <div className="w-12"></div>
      </header>

      <div className="px-10 mb-12">
        <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <main className="px-6 pb-32">
        <div className="flex justify-between px-4 mb-12">
          {studies.map((_, i) => (
            <button 
              key={i} 
              onClick={() => { setIdx(i); setInsight(null); }} 
              className={`w-10 h-10 rounded-2xl font-black text-[10px] transition-all duration-500 border ${i === idx ? 'bg-stone-900 border-stone-900 text-white scale-110 shadow-lg' : (i < idx ? 'bg-amber-100 border-amber-100 text-amber-600' : 'bg-white border-stone-100 text-stone-300')}`}
            >
              0{i + 1}
            </button>
          ))}
        </div>

        <article className="bg-white rounded-[48px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-stone-100 transition-all">
          <div className="relative h-72 overflow-hidden bg-stone-50">
            <img src={current.image} className="w-full h-full object-cover" alt={current.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-stone-900/10 to-transparent"></div>
          </div>
          
          <div className="px-10 pb-12 pt-8">
            <h1 className="font-serif text-4xl text-stone-900 font-bold leading-tight mb-10">{current.title}</h1>
            
            <div className="relative mb-12 group">
              <div className="absolute -left-4 top-0 bottom-0 w-[3px] bg-amber-500/30 rounded-full"></div>
              <p className="font-serif text-2xl text-stone-800 italic leading-relaxed pl-6">"{current.verse}"</p>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] mb-4">Meditação</h3>
                <p className="text-stone-600 leading-relaxed text-lg font-serif">{current.explanation}</p>
              </section>

              <section className="bg-stone-50 rounded-[32px] p-8 border border-stone-100">
                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-4">Aplicação Prática</h3>
                <p className="text-stone-900 font-bold text-lg leading-snug">{current.application}</p>
              </section>

              <button 
                onClick={handleAI} 
                disabled={loading} 
                className="w-full bg-stone-900 text-amber-500 py-6 rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                {loading ? 'DESVELANDO...' : 'REVELAÇÃO IA'}
              </button>

              {insight && (
                <div className="mt-8 p-10 bg-[#FDFBF7] rounded-[40px] border border-amber-100 animate-in zoom-in text-stone-800 font-serif leading-relaxed text-lg italic shadow-inner">
                  {insight}
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Studies;
