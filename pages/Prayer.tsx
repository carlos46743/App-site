
import React, { useState, useEffect, useRef } from 'react';
import { DB } from '../db';
import { Prayer, PrayerRequest, Comment } from '../types';
import { generatePrayerAI, generateSpeechAI, decodePCM } from '../geminiService';

interface PrayerProps {
  onBack: () => void;
}

const PrayerPage: React.FC<PrayerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'community'>('daily');
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [communityRequests, setCommunityRequests] = useState<PrayerRequest[]>([]);
  const [timeGreeting, setTimeGreeting] = useState({ label: '', icon: '', theme: '' });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [activePrayerId, setActivePrayerId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestContent, setNewRequestContent] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    setPrayers(DB.getPrayers());
    setCommunityRequests(DB.getCommunityPrayers());
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeGreeting({ label: 'Oração da Manhã', icon: '🌅', theme: 'gratidão e novo dia' });
    } else if (hour >= 12 && hour < 18) {
      setTimeGreeting({ label: 'Oração da Tarde', icon: '☀️', theme: 'fortalecimento e paz' });
    } else {
      setTimeGreeting({ label: 'Oração da Noite', icon: '🌙', theme: 'repouso e entrega' });
    }
    return () => stopAudio();
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setActivePrayerId(null);
  };

  const handleRead = async (text: string, id: string) => {
    if (activePrayerId === id && isPlaying) {
      stopAudio();
      return;
    }
    stopAudio();
    setLoadingAudioId(id);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      const audioData = await generateSpeechAI(text);
      if (audioData) {
        const buffer = await decodePCM(audioData, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => { setIsPlaying(false); setActivePrayerId(null); };
        source.start();
        sourceNodeRef.current = source;
        setIsPlaying(true);
        setActivePrayerId(id);
      }
    } catch (e) { console.error(e); } finally { setLoadingAudioId(null); }
  };

  const handlePostRequest = () => {
    if (!newRequestName || !newRequestContent) return;
    DB.saveCommunityPrayer({
      id: Date.now().toString(),
      userName: newRequestName,
      content: newRequestContent,
      timestamp: Date.now(),
      amens: 0,
      comments: []
    });
    setCommunityRequests(DB.getCommunityPrayers());
    setNewRequestName(''); setNewRequestContent(''); setShowForm(false);
  };

  return (
    <div className="p-6 animate-in slide-in-from-bottom duration-500 pb-32 min-h-screen">
      <header className="flex items-center justify-between mb-8 py-6">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm text-stone-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.4em]">COMUNHÃO</h2>
        <div className="w-12"></div>
      </header>

      <div className="mb-8 px-6 py-5 bg-amber-50 rounded-[32px] border border-amber-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{timeGreeting.icon}</span>
          <div>
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">{timeGreeting.label}</p>
            <p className="text-[9px] text-amber-600/60 font-medium">Momento de reflexão</p>
          </div>
        </div>
        <button 
          onClick={async () => {
            setLoadingAudioId('time-prayer');
            const res = await generatePrayerAI(timeGreeting.theme);
            if(res) handleRead(res, 'time-prayer');
          }}
          disabled={loadingAudioId === 'time-prayer'}
          className="bg-amber-600 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20 active:scale-95"
        >
          {loadingAudioId === 'time-prayer' ? '...' : 'OUVIR'}
        </button>
      </div>

      <div className="flex bg-stone-100 p-1.5 rounded-[30px] mb-12">
        <button onClick={() => setActiveTab('daily')} className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'daily' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>Mural Local</button>
        <button onClick={() => setActiveTab('community')} className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'community' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>Mural da Fé</button>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-10 animate-in fade-in">
          {prayers.length === 0 && <div className="py-20 text-center opacity-30 text-stone-400 italic">Nenhuma oração pessoal.</div>}
          {prayers.map(p => (
            <div key={p.id} className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-4">{p.type} • {p.date}</span>
              <p className="font-serif text-stone-500 italic text-xl mb-8 leading-relaxed">"{p.content}"</p>
              <button onClick={() => handleRead(p.content, p.id)} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 ${activePrayerId === p.id ? 'bg-amber-600 text-white' : 'bg-stone-50 text-stone-400'}`}>
                {loadingAudioId === p.id ? 'GERANDO...' : 'OUVIR COM IA'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in">
          <button onClick={() => setShowForm(!showForm)} className="w-full bg-stone-900 text-amber-500 py-6 rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] mb-12 shadow-xl active:scale-95">
            {showForm ? 'CANCELAR' : 'DEIXAR PEDIDO DE ORAÇÃO'}
          </button>
          {showForm && (
            <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-lg mb-12 space-y-4">
              <input placeholder="Seu Nome" className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm outline-none" value={newRequestName} onChange={e => setNewRequestName(e.target.value)} />
              <textarea placeholder="Pedido de Oração..." rows={4} className="w-full bg-stone-50 border-none rounded-[32px] px-6 py-4 text-sm outline-none" value={newRequestContent} onChange={e => setNewRequestContent(e.target.value)} />
              <button onClick={handlePostRequest} className="w-full bg-amber-600 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest">PUBLICAR NO MURAL</button>
            </div>
          )}
          <div className="space-y-8 pb-20">
            {communityRequests.map(req => (
              <div key={req.id} className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-stone-900">{req.userName}</span>
                  <span className="text-[10px] font-bold text-stone-300 uppercase">{new Date(req.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="font-serif text-stone-600 leading-relaxed text-lg mb-8 italic">"{req.content}"</p>
                <div className="flex gap-4">
                  <button onClick={() => { DB.addAmen(req.id); setCommunityRequests(DB.getCommunityPrayers()); }} className="flex-1 bg-amber-50 text-amber-600 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all">
                    🙏 AMÉM {req.amens > 0 && `(${req.amens})`}
                  </button>
                  <button onClick={() => setCommentingOn(commentingOn === req.id ? null : req.id)} className="flex-1 bg-stone-50 text-stone-400 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                    💬 APOIAR {req.comments?.length > 0 && `(${req.comments.length})`}
                  </button>
                </div>
                {commentingOn === req.id && (
                  <div className="mt-8 pt-8 border-t border-stone-50 space-y-4">
                    {req.comments?.map(c => <div key={c.id} className="bg-stone-50 p-4 rounded-2xl text-xs text-stone-600"><span className="font-bold text-amber-600">{c.userName}:</span> {c.content}</div>)}
                    <div className="flex gap-2">
                      <input placeholder="Sua palavra..." className="flex-1 bg-stone-100 rounded-2xl px-5 py-3 text-xs outline-none" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyPress={e => e.key === 'Enter' && (DB.addComment(req.id, { id: Date.now().toString(), userName: 'Intercessor', content: newComment, timestamp: Date.now() }), setCommunityRequests(DB.getCommunityPrayers()), setNewComment(''))} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerPage;
