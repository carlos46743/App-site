
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Prayer } from '../types';
import { generatePrayerAI } from '../geminiService';

interface PrayerProps {
  onBack: () => void;
}

const PrayerPage: React.FC<PrayerProps> = ({ onBack }) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [speechStatus, setSpeechStatus] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const [activePrayerId, setActivePrayerId] = useState<string | null>(null);
  
  const [mood, setMood] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedPrayer, setGeneratedPrayer] = useState<string | null>(null);

  useEffect(() => {
    setPrayers(DB.getPrayers());
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleRead = (text: string, id: string) => {
    if (activePrayerId === id) {
      if (speechStatus === 'playing') {
        window.speechSynthesis.pause();
        setSpeechStatus('paused');
      } else if (speechStatus === 'paused') {
        window.speechSynthesis.resume();
        setSpeechStatus('playing');
      } else {
        startNewUtterance(text, id);
      }
      return;
    }
    window.speechSynthesis.cancel();
    startNewUtterance(text, id);
  };

  const startNewUtterance = (text: string, id: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    
    utterance.onstart = () => {
      setSpeechStatus('playing');
      setActivePrayerId(id);
    };
    
    utterance.onend = () => {
      setSpeechStatus('stopped');
      setActivePrayerId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleGeneratePrayer = async () => {
    if (!mood) return;
    setAiLoading(true);
    const res = await generatePrayerAI(mood);
    setGeneratedPrayer(res || null);
    setAiLoading(false);
  };

  return (
    <div className="p-6 animate-in slide-in-from-bottom duration-500 pb-32 min-h-screen">
      <header className="flex items-center justify-between mb-12 py-6">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm text-stone-400 active:scale-90 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.5em]">MOMENTO SAGRADO</h2>
          <div className="w-4 h-0.5 bg-amber-500 mx-auto mt-2 rounded-full"></div>
        </div>
        <div className="w-12"></div>
      </header>

      {/* AI Section: Elegant Card */}
      <section className="bg-white rounded-[40px] p-10 mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-stone-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Oração Personalizada</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">GERADA PELA IA</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-stone-500 text-sm leading-relaxed mb-6 font-serif italic">Descreva seus sentimentos para receber uma oração exclusiva.</p>
          <div className="relative">
            <input 
              placeholder="Ex: Grato pela família, busca por paz..."
              className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:bg-white transition-all text-stone-800"
              value={mood}
              onChange={e => setMood(e.target.value)}
            />
            <button 
              onClick={handleGeneratePrayer}
              disabled={aiLoading || !mood}
              className="absolute right-2 top-2 bottom-2 bg-stone-900 text-amber-500 px-6 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-30 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              {aiLoading ? '...' : 'GERAR'}
            </button>
          </div>
        </div>

        {generatedPrayer && (
          <div className="mt-10 p-10 bg-stone-50 rounded-[32px] border border-stone-100 animate-in zoom-in duration-300">
            <p className="text-stone-800 font-serif italic text-xl leading-relaxed mb-8">"{generatedPrayer}"</p>
            <VoiceControlButton 
              label={activePrayerId === 'ai-prayer' ? (speechStatus === 'playing' ? 'PAUSAR' : 'CONTINUAR') : 'OUVIR ORAÇÃO'} 
              icon={activePrayerId === 'ai-prayer' && speechStatus === 'playing' ? <PauseIcon/> : <PlayIcon/>}
              active={activePrayerId === 'ai-prayer'}
              onClick={() => handleRead(generatedPrayer, 'ai-prayer')}
            />
          </div>
        )}
      </section>

      <div className="space-y-12">
        <div className="flex items-center gap-4 px-4">
          <div className="h-px flex-1 bg-stone-100"></div>
          <h3 className="text-[9px] font-black text-stone-300 uppercase tracking-[0.5em]">COMUNIDADE</h3>
          <div className="h-px flex-1 bg-stone-100"></div>
        </div>

        {prayers.map(p => (
          <div key={p.id} className="bg-white rounded-[40px] p-10 shadow-sm border border-stone-100">
             <div className="flex items-center justify-between mb-8">
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-full">
                  {p.type === 'manha' ? 'Alvorada' : p.type === 'noite' ? 'Crepúsculo' : 'Espiritual'}
                </div>
                <span className="text-[10px] font-bold text-stone-300 uppercase">{p.date}</span>
             </div>

             <h4 className="font-serif text-2xl text-stone-900 font-bold mb-6 leading-tight">{p.title}</h4>
             <div className="font-serif text-stone-500 leading-relaxed italic mb-10 text-xl">
               "{p.content}"
             </div>

             <VoiceControlButton 
                label={activePrayerId === p.id ? (speechStatus === 'playing' ? 'PAUSAR' : 'CONTINUAR') : 'OUVIR'} 
                icon={activePrayerId === p.id && speechStatus === 'playing' ? <PauseIcon/> : <PlayIcon/>}
                active={activePrayerId === p.id}
                onClick={() => handleRead(p.content, p.id)}
             />
          </div>
        ))}
      </div>
    </div>
  );
};

const VoiceControlButton = ({ label, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${active ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;

export default PrayerPage;
