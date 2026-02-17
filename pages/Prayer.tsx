
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
  
  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [activePrayerId, setActivePrayerId] = useState<string | null>(null);
  
  // New Request states
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestContent, setNewRequestContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Comment states
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    setPrayers(DB.getPrayers());
    setCommunityRequests(DB.getCommunityPrayers());
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
    const req: PrayerRequest = {
      id: Date.now().toString(),
      userName: newRequestName,
      content: newRequestContent,
      timestamp: Date.now(),
      amens: 0,
      comments: []
    };
    DB.saveCommunityPrayer(req);
    setCommunityRequests(DB.getCommunityPrayers());
    setNewRequestName('');
    setNewRequestContent('');
    setShowForm(false);
  };

  const handleAddAmen = (id: string) => {
    DB.addAmen(id);
    setCommunityRequests(DB.getCommunityPrayers());
  };

  const handleAddComment = (prayerId: string) => {
    if (!newComment) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userName: 'Intercessor',
      content: newComment,
      timestamp: Date.now()
    };
    DB.addComment(prayerId, comment);
    setCommunityRequests(DB.getCommunityPrayers());
    setNewComment('');
    setCommentingOn(null);
  };

  return (
    <div className="p-6 animate-in slide-in-from-bottom duration-500 pb-32 min-h-screen">
      <header className="flex items-center justify-between mb-8 py-6">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm text-stone-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.4em]">COMUNHÃO</h2>
          <div className="w-4 h-0.5 bg-amber-500 mx-auto mt-2 rounded-full"></div>
        </div>
        <div className="w-12"></div>
      </header>

      {/* Navegação entre Orações e Mural */}
      <div className="flex bg-stone-100 p-1.5 rounded-[30px] mb-12">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'daily' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}
        >
          Minhas Orações
        </button>
        <button 
          onClick={() => setActiveTab('community')}
          className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'community' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}
        >
          Mural da Fé
        </button>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-10 animate-in fade-in">
          {prayers.length === 0 && (
            <div className="py-20 text-center text-stone-300 italic">Nenhuma oração pessoal salva. Use o Mentor IA para criar uma.</div>
          )}
          {prayers.map(p => (
            <div key={p.id} className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-4">{p.type} • {p.date}</span>
              <h4 className="font-serif text-2xl font-bold mb-4">{p.title}</h4>
              <p className="font-serif text-stone-500 italic text-xl mb-8 leading-relaxed">"{p.content}"</p>
              <VoiceBtn 
                label={loadingAudioId === p.id ? 'GERANDO...' : (activePrayerId === p.id && isPlaying ? 'PARAR' : 'OUVIR COM IA')} 
                loading={loadingAudioId === p.id}
                active={activePrayerId === p.id}
                onClick={() => handleRead(p.content, p.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-stone-900 text-amber-500 py-6 rounded-[30px] font-black text-[10px] uppercase tracking-[0.3em] mb-12 shadow-xl"
          >
            {showForm ? 'CANCELAR PEDIDO' : 'DEIXAR PEDIDO DE ORAÇÃO'}
          </button>

          {showForm && (
            <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-lg mb-12 space-y-4 animate-in slide-in-from-top duration-300">
              <input 
                placeholder="Seu Nome"
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm focus:outline-none"
                value={newRequestName}
                onChange={e => setNewRequestName(e.target.value)}
              />
              <textarea 
                placeholder="Qual sua necessidade espiritual?"
                rows={4}
                className="w-full bg-stone-50 border border-stone-100 rounded-[32px] px-6 py-4 text-sm focus:outline-none"
                value={newRequestContent}
                onChange={e => setNewRequestContent(e.target.value)}
              />
              <button onClick={handlePostRequest} className="w-full bg-amber-600 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest">ENVIAR AO MURAL</button>
            </div>
          )}

          <div className="space-y-8">
            {communityRequests.map(req => (
              <div key={req.id} className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-bold text-sm">{req.userName.charAt(0)}</div>
                    <span className="text-sm font-bold text-stone-900">{req.userName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter">{new Date(req.timestamp).toLocaleDateString()}</span>
                </div>
                
                <p className="font-serif text-stone-600 leading-relaxed text-lg mb-8 italic">"{req.content}"</p>
                
                <div className="flex gap-4 items-center">
                  <button onClick={() => handleAddAmen(req.id)} className="flex-1 bg-amber-50 text-amber-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <span>🙏 AMÉM</span>
                    {req.amens > 0 && <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-[8px]">{req.amens}</span>}
                  </button>
                  <button onClick={() => setCommentingOn(commentingOn === req.id ? null : req.id)} className="flex-1 bg-stone-50 text-stone-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <span>💬 APOIAR</span>
                    {req.comments?.length > 0 && <span>({req.comments.length})</span>}
                  </button>
                </div>

                {commentingOn === req.id && (
                  <div className="mt-8 pt-8 border-t border-stone-50 space-y-6">
                    <div className="space-y-4">
                      {req.comments?.map(c => (
                        <div key={c.id} className="bg-stone-50 p-4 rounded-2xl">
                           <p className="text-xs text-stone-600 leading-relaxed">
                             <span className="font-black text-amber-600 mr-2">{c.userName}:</span> {c.content}
                           </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        placeholder="Deixe uma palavra de fé..."
                        className="flex-1 bg-stone-100 border-none rounded-2xl px-5 py-3 text-xs outline-none"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddComment(req.id)}
                      />
                      <button onClick={() => handleAddComment(req.id)} className="bg-stone-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">➜</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {communityRequests.length === 0 && <div className="py-20 text-center text-stone-300 italic">Mural vazio. Seja o primeiro a pedir oração.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

const VoiceBtn = ({ label, loading, active, onClick }: any) => (
  <button onClick={onClick} disabled={loading} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${active ? 'bg-amber-600 text-white shadow-lg' : 'bg-stone-100 text-stone-400'}`}>
    {loading ? <div className="w-3 h-3 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin"></div> : <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z"/></svg>}
    {label}
  </button>
);

export default PrayerPage;
