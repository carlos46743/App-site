
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
    <div className="animate-in fade-in duration-300">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-stone-50/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400">←</button>
        <h2 className="font-bold text-stone-800">Artigos de Reflexão</h2>
        <div className="w-10"></div>
      </header>

      <main className="px-6 space-y-6">
        {articles.length === 0 ? (
          <div className="bg-white rounded-[32px] p-10 text-center text-stone-400">
            Nenhum artigo publicado ainda.
          </div>
        ) : (
          articles.map(art => (
            <article key={art.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100 transition hover:shadow-md">
              {art.image && <img src={art.image} alt={art.title} className="w-full h-40 object-cover rounded-[20px] mb-6" />}
              <h1 className="text-2xl font-bold text-stone-800 leading-tight mb-2">{art.title}</h1>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-6">
                <span>✍️ {art.author}</span>
                <span>•</span>
                <span>📅 {art.date}</span>
              </div>
              <div className="text-stone-600 font-serif leading-relaxed line-clamp-4 whitespace-pre-wrap mb-4">
                {art.content}
              </div>
              <button className="text-amber-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Ler Artigo Completo <span>→</span>
              </button>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Articles;
