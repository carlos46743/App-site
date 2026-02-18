
import React, { useState, useEffect, useRef } from 'react';
import { DB } from '../db';
import { Study } from '../types';
import { getBiblicalInsight, generateSpeechAI, decodePCM } from '../geminiService';

const Studies: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [idx, setIdx] = useState(0);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const loadedStudies = DB.getStudies();
    setStudies(loadedStudies.slice(0, 7));
    return () => stopAudio();
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Silent catch
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

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

  const handleOuvir = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (!current) return;
    setLoadingAudio(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      
      const textToRead = `Estudo: ${current.title}. Versículo: ${current.verse}. Meditação: ${current.explanation}. Aplicação: ${current.application}`;
      const audioData = await generateSpeechAI(textToRead);
      
      if (audioData) {
        const buffer = await decodePCM(audioData, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        sourceNodeRef.current = source;
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Erro ao gerar áudio do estudo:", e);
    } finally {
      setLoadingAudio(false);
    }
  };

  if (studies.length === 0) return (
    <div className="flex items-center justify-center min-h-screen text-stone-400 font-serif italic bg-[#FDFBF7]">
      Carregando jornada...
    </div>
  );

  const progress = ((idx + 1) / studies.length) * 100;
  const defaultImage = "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="animate-in slide-in-from-right duration-500 min-h-screen pb-40 bg-[#FDFBF7]">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl z-30">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm text-stone-400 active:scale-90 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <span className="font-black text-stone-900 text-[9px] tracking-[0.5em] uppercase block mb-1">JORNADA SAGRADA</span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Passo {idx + 1} de {studies.length}</span>
        </div>
        <div className="w-12"></div>
      </header>

      <div className="px-10 mb-8">
        <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <main className="px-6">
        <div className="flex justify-between px-2 mb-8 overflow-x-auto no-scrollbar gap-3 pb-2">
          {studies.map((_, i) => (
            <button 
              key={i} 
              onClick={() => { setIdx(i); setInsight(null); stopAudio(); }} 
              className={`min-w-[44px] h-11 rounded-2xl font-black text-[10px] transition-all duration-500 border ${i === idx ? 'bg-stone-900 border-stone-900 text-white scale-110 shadow-lg' : (i < idx ? 'bg-amber-100 border-amber-100 text-amber-600' : 'bg-white border-stone-100 text-stone-300')}`}
            >
              0{i + 1}
            </button>
          ))}
        </div>

        <article className="bg-white rounded-[56px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-stone-100 transition-all mb-10">
          {/* Imagem em destaque no topo do card */}
          <div className="relative h-80 overflow-hidden bg-stone-50">
            <img 
              src={current.image || defaultImage} 
              className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110" 
              alt={current.title} 
            />
            {/* Gradiente para profundidade visual */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10"></div>
            
            {/* Botão de áudio flutuante sobre a imagem */}
            <button 
              onClick={handleOuvir}
              disabled={loadingAudio}
              className={`absolute bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 z-20 ${isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
            >
              {loadingAudio ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
          
          <div className="px-10 pb-14 pt-10">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
               <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">{current.date}</span>
            </div>
            
            <h1 className="font-serif text-4xl text-stone-900 font-bold leading-tight mb-10 tracking-tight">{current.title}</h1>
            
            <div className="relative mb-12 py-2">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber-500/40 rounded-full"></div>
              <p className="font-serif text-2xl text-stone-800 italic leading-relaxed pl-8">"{current.verse}"</p>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">Meditação</span>
                  <div className="flex-1 h-px bg-stone-100"></div>
                </div>
                <p className="text-stone-600 leading-relaxed text-lg font-serif">{current.explanation}</p>
              </section>

              <section className="bg-amber-50/50 rounded-[40px] p-10 border border-amber-100/50 shadow-inner">
                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-4">Aplicação Diária</h3>
                <p className="text-stone-900 font-bold text-xl leading-snug">{current.application}</p>
              </section>

              <div className="pt-4">
                <button 
                  onClick={handleAI} 
                  disabled={loading} 
                  className="w-full bg-stone-900 text-amber-500 py-7 rounded-[30px] font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4 border border-stone-800"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  {loading ? 'REVELANDO...' : 'SABEDORIA IA'}
                </button>
              </div>

              {insight && (
                <div className="mt-8 p-10 bg-[#FDFBF7] rounded-[48px] border border-amber-100 animate-in zoom-in slide-in-from-bottom-8 duration-700 text-stone-800 font-serif leading-relaxed text-lg italic shadow-inner">
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
