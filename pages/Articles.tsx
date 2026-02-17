
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Article } from '../types';

interface ArticlesProps {
  onBack: () => void;
}

const Articles: React.FC<ArticlesProps> = ({ onBack }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(DB.getArticles().sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-32 bg-stone-50 min-h-screen">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-stone-50/90 backdrop-blur-xl z-30">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-stone-400 border border-stone-100 active:scale-90 transition-all">←</button>
        <span className="font-black text-stone-900 text-[10px] tracking-[0.4em] uppercase">REFLEXÕES</span>
        <div className="w-12"></div>
      </header>

      <main className="px-6 space-y-12">
        {articles.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Aguardando novas reflexões...</p>
          </div>
        ) : (
          articles.map(art => (
            <article key={art.id} className="bg-white rounded-[50px] overflow-hidden shadow-sm border border-stone-100 transition-all hover:shadow-xl">
              <div className="relative aspect-video overflow-hidden bg-stone-100">
                {art.image ? (
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-20">✒️</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              
              <div className="px-10 pb-12 pt-4">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-stone-900 leading-tight font-serif mb-2">{art.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">por {art.author}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{art.date}</span>
                  </div>
                </div>
                
                <div className="text-stone-600 font-serif leading-relaxed text-lg whitespace-pre-wrap mb-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-stone-900">
                  {art.content}
                </div>
                
                <div className="h-px bg-stone-100 w-full mb-8"></div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Reflexão Concluída</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                </div>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Articles;
