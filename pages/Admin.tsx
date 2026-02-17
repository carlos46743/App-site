
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Study, Article, Prayer, QuizQuestion } from '../types';
import { generateQuizAI, generatePrayerAI } from '../geminiService';

const Admin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'studies' | 'articles' | 'quiz' | 'prayers'>('studies');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual Form States
  const [mTitle, setMTitle] = useState('');
  const [mContent, setMContent] = useState('');
  const [mImage, setMImage] = useState('');
  const [mVerse, setMVerse] = useState(''); // Only for studies
  const [mAuthor, setMAuthor] = useState(''); // Only for articles
  const [mApp, setMApp] = useState(''); // Only for studies

  useEffect(() => {
    refreshList();
  }, [activeTab]);

  const refreshList = () => {
    if (activeTab === 'studies') setItems(DB.getStudies());
    if (activeTab === 'articles') setItems(DB.getArticles());
    if (activeTab === 'quiz') setItems(DB.getQuiz());
    if (activeTab === 'prayers') setItems(DB.getPrayers());
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'studies') DB.deleteStudy(id);
    if (activeTab === 'articles') DB.deleteArticle(id);
    if (activeTab === 'quiz') DB.deleteQuizQuestion(id);
    if (activeTab === 'prayers') DB.deletePrayer(id);
    refreshList();
  };

  const handleManualSave = () => {
    if (!mTitle || !mContent) return alert("Preencha o título e o conteúdo.");
    
    if (activeTab === 'studies') {
      const newStudy: Study = {
        id: Date.now().toString(),
        title: mTitle,
        verse: mVerse || 'Referência Bíblica',
        explanation: mContent,
        application: mApp || 'Aplicação diária...',
        prayer: 'Senhor...',
        date: new Date().toLocaleDateString(),
        image: mImage,
        timestamp: Date.now()
      };
      DB.saveStudy(newStudy);
    } else if (activeTab === 'articles') {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: mTitle,
        author: mAuthor || 'Equipe Pão Diário',
        content: mContent,
        image: mImage,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      };
      DB.saveArticle(newArticle);
    }
    
    resetManualForm();
    setShowManualForm(false);
    refreshList();
  };

  const resetManualForm = () => {
    setMTitle('');
    setMContent('');
    setMImage('');
    setMVerse('');
    setMAuthor('');
    setMApp('');
  };

  // IA logic
  const [topic, setTopic] = useState('');

  const handleGenQuiz = async () => {
    if (!topic) return alert("Digite um tema (ex: Parábolas)");
    setLoading(true);
    const qs = await generateQuizAI(topic);
    if (qs) {
      qs.forEach((q: any) => DB.saveQuizQuestion({ ...q, id: Math.random().toString(36).substr(2, 9) }));
      refreshList();
      alert("3 Questões geradas!");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in bg-stone-50 min-h-screen">
      <header className="flex items-center justify-between mb-10 pt-4">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-stone-400 border border-stone-100 active:scale-90">←</button>
        <h2 className="font-black text-stone-900 text-xs uppercase tracking-[0.3em]">Gestão de Conteúdo</h2>
        <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-amber-500 text-[10px] font-black">PRO</div>
      </header>

      <nav className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
        <AdminTab active={activeTab === 'studies'} onClick={() => {setActiveTab('studies'); setShowManualForm(false);}} label="Estudos" />
        <AdminTab active={activeTab === 'articles'} onClick={() => {setActiveTab('articles'); setShowManualForm(false);}} label="Artigos" />
        <AdminTab active={activeTab === 'quiz'} onClick={() => {setActiveTab('quiz'); setShowManualForm(false);}} label="Quiz" />
        <AdminTab active={activeTab === 'prayers'} onClick={() => {setActiveTab('prayers'); setShowManualForm(false);}} label="Orações" />
      </nav>

      {(activeTab === 'studies' || activeTab === 'articles') && (
        <div className="mb-8">
           <button 
             onClick={() => setShowManualForm(!showManualForm)}
             className={`w-full py-5 rounded-[30px] border-2 border-dashed font-black text-[10px] uppercase tracking-widest transition-all ${showManualForm ? 'bg-stone-900 text-white border-transparent' : 'bg-transparent text-stone-400 border-stone-200 hover:border-amber-300'}`}
           >
             {showManualForm ? 'CANCELAR CADASTRO' : `+ NOVO ${activeTab === 'studies' ? 'ESTUDO' : 'ARTIGO'} MANUAL`}
           </button>
        </div>
      )}

      {showManualForm && (
        <div className="bg-white rounded-[45px] p-10 shadow-2xl border border-stone-100 mb-10 animate-in slide-in-from-top duration-300">
           <h3 className="text-stone-900 font-black text-xs uppercase tracking-widest mb-8">Cadastro de {activeTab === 'studies' ? 'Estudo' : 'Artigo'}</h3>
           <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-4">Título Principal</label>
                <input 
                  placeholder="Ex: A Graça de Deus"
                  className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                  value={mTitle}
                  onChange={e => setMTitle(e.target.value)}
                />
              </div>

              {activeTab === 'articles' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-4">Nome do Autor</label>
                  <input 
                    placeholder="Ex: Pastor João Silva"
                    className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                    value={mAuthor}
                    onChange={e => setMAuthor(e.target.value)}
                  />
                </div>
              )}

              {activeTab === 'studies' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-4">Referência Bíblica</label>
                  <input 
                    placeholder="Ex: João 3:16"
                    className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                    value={mVerse}
                    onChange={e => setMVerse(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-4">URL da Imagem de Capa</label>
                <input 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                  value={mImage}
                  onChange={e => setMImage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-4">Conteúdo</label>
                <textarea 
                  placeholder="Escreva aqui..."
                  rows={5}
                  className="w-full bg-stone-50 border border-stone-100 rounded-[32px] px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                  value={mContent}
                  onChange={e => setMContent(e.target.value)}
                />
              </div>

              {activeTab === 'studies' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-4">Aplicação Diária</label>
                  <input 
                    placeholder="Como aplicar este estudo hoje?"
                    className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
                    value={mApp}
                    onChange={e => setMApp(e.target.value)}
                  />
                </div>
              )}

              <button 
                onClick={handleManualSave}
                className="w-full bg-amber-600 text-white py-5 rounded-3xl font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-amber-600/30 active:scale-95 transition-all mt-4"
              >
                PUBLICAR CONTEÚDO
              </button>
           </div>
        </div>
      )}

      {!showManualForm && (
        <div className="bg-stone-900 rounded-[45px] p-10 mb-12 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-amber-500 animate-pulse text-2xl">✨</span>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Inteligência Criativa</h3>
            </div>
            <div className="flex gap-3">
              <input 
                placeholder={activeTab === 'quiz' ? "Tema do Quiz..." : "Tema para Oração..."}
                className="flex-1 bg-white/5 border border-white/10 rounded-[28px] px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
              <button 
                onClick={activeTab === 'quiz' ? handleGenQuiz : () => {}}
                disabled={loading || activeTab === 'studies' || activeTab === 'articles'}
                className="bg-amber-600 px-8 py-4 rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 disabled:opacity-20 transition-all shadow-lg active:scale-95"
              >
                {loading ? '...' : 'GERAR'}
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl pointer-events-none group-hover:scale-125 transition-transform duration-1000 font-serif">✝</div>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between px-4 mb-2">
          <h3 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">Registros Atuais</h3>
          <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tighter">{items.length} itens</span>
        </div>
        
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-100 flex items-center justify-between transition-all hover:translate-x-1 hover:shadow-md">
            <div className="flex items-center gap-5 flex-1 min-w-0 mr-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-50">
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl grayscale opacity-30">
                    {activeTab === 'quiz' ? '💡' : '📖'}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-stone-800 text-sm truncate">{item.title || item.question || item.content?.substring(0, 30)}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">{item.date || 'Registro'}</span>
                  {activeTab === 'studies' && <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest">• ESTUDO</span>}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-stone-200 hover:bg-red-50 hover:text-red-400 transition-all active:scale-90"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="py-24 text-center text-stone-300 italic bg-white/30 rounded-[50px] border-2 border-dashed border-stone-100">
             Nenhum item encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

const AdminTab = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 rounded-3xl text-[10px] font-black transition-all flex-shrink-0 uppercase tracking-[0.2em] border-2 ${active ? 'bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-600/20 scale-105' : 'bg-white border-white text-stone-400 shadow-sm hover:text-stone-600 hover:border-stone-200'}`}
  >
    {label}
  </button>
);

export default Admin;
