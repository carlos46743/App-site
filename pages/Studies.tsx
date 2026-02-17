
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
    setStudies(DB.getStudies());
  }, []);

  const current = studies[idx];

  const handleAI = async () => {
    if (!current) return;
    setLoading(true);
    const res = await getBiblicalInsight(current.verse, current.explanation);
    setInsight(res || null);
    setLoading(false);
  };

  if (studies.length === 0) return (
    <div className="p-10 text-center">
      <button onClick={onBack} className="text-stone-400 mb-10">← Voltar</button>
      <div className="bg-white p-10 rounded-[40px] text-stone-400 italic">Crie um estudo no Admin para começar.</div>
    </div>
  );

  return (
    <div className="animate-in slide-in-from-right duration-500 bg-stone-50 min-h-screen">
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-stone-50/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400">←</button>
        <span className="font-bold text-stone-800 text-sm tracking-widest uppercase">Mergulho Bíblico</span>
        <div className="w-10"></div>
      </header>

      <main className="px-6 pb-20">
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar py-2">
          {studies.map((_, i) => (
            <button 
              key={i} 
              onClick={() => { setIdx(i); setInsight(null); }}
              className={`w-12 h-12 rounded-full font-bold flex-shrink-0 transition-all ${i === idx ? 'bg-amber-600 text-white scale-110 shadow-lg' : 'bg-white text-stone-300 shadow-sm'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <article className="bg-white rounded-[45px] overflow-hidden shadow-2xl border border-stone-100">
          {current.image && <img src={current.image} className="w-full h-64 object-cover" alt="Estudo" />}
          
          <div className="p-8">
            <span className="text-[10px] font-bold text-amber-600 tracking-[0.2em] mb-4 block">LIÇÃO DO DIA</span>
            <h1 className="font-serif text-3xl text-stone-800 leading-tight mb-8">{current.title}</h1>

            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-4">Escritura</h3>
                <p className="font-serif text-2xl text-stone-700 italic border-l-4 border-amber-200 pl-6 leading-relaxed">
                  {current.verse}
                </p>
              </section>

              <section>
                <h3 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-4">Meditação</h3>
                <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-wrap">{current.explanation}</p>
              </section>

              <section className="bg-stone-50 p-8 rounded-[30px] border border-stone-100">
                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Aplicação Prática</h3>
                <p className="text-stone-700 font-medium leading-relaxed">{current.application}</p>
              </section>
            </div>

            <button 
              onClick={handleAI}
              disabled={loading}
              className="w-full mt-12 bg-stone-900 text-white py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
            >
              {loading ? 'Consultando IA...' : '✨ Obter Revelação Profunda'}
            </button>

            {insight && (
              <div className="mt-8 p-8 bg-amber-50 rounded-[35px] border border-amber-100 animate-in zoom-in duration-500">
                <h4 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                  <span>📖</span> Perspectiva Teológica
                </h4>
                <div className="text-amber-900 leading-relaxed prose prose-sm prose-amber">
                   {insight}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default Studies;
