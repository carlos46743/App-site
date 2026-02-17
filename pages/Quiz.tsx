
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { QuizQuestion } from '../types';
import { generateQuizAI } from '../geminiService';

const Quiz: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = DB.getQuiz();
    setQuestions(saved);
  }, []);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleGenerateAI = async () => {
    if (!topic) return;
    setLoading(true);
    const newQs = await generateQuizAI(topic);
    if (newQs && newQs.length > 0) {
      setQuestions(newQs);
      setCurrentIdx(0);
      setScore(0);
      setAnswered(null);
      setIsFinished(false);
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setAnswered(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="p-8 text-center animate-in zoom-in min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-[56px] p-12 shadow-2xl border border-stone-100 w-full max-w-sm">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-2 font-serif">Concluído</h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-10">Desafio Finalizado</p>
          
          <div className="text-7xl font-black text-stone-900 mb-12 tracking-tighter">
            {Math.round((score / questions.length) * 100)}<span className="text-amber-500 text-3xl">%</span>
          </div>
          
          <div className="space-y-4">
            <button onClick={() => { setIsFinished(false); setCurrentIdx(0); setScore(0); setAnswered(null); }} className="w-full bg-stone-900 text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">Recomeçar</button>
            <button onClick={onBack} className="w-full py-4 text-stone-400 font-bold text-[10px] uppercase tracking-widest">Voltar ao Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-in slide-in-from-right duration-500 min-h-screen">
      <header className="flex items-center justify-between mb-12 py-6">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm text-stone-400 active:scale-90 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="font-black text-stone-900 text-[10px] tracking-[0.5em] uppercase">CONHECIMENTO</span>
        <div className="w-12"></div>
      </header>

      {/* AI Theme Picker: Minimalist */}
      <div className="bg-stone-900 rounded-[40px] p-10 mb-12 shadow-2xl border border-stone-800">
        <h3 className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] mb-6">PERSONALIZAR TESTE</h3>
        <div className="flex gap-3">
          <input 
            placeholder="Tema bíblico (Ex: Salmos)" 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-stone-600"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button onClick={handleGenerateAI} disabled={loading || !topic} className="bg-amber-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 disabled:opacity-20 transition-all">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>}
          </button>
        </div>
      </div>

      {questions.length > 0 ? (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6 px-2">
            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Pergunta {currentIdx + 1} de {questions.length}</span>
            <span className="text-[10px] font-black text-amber-600 uppercase">Acertos: {score}</span>
          </div>
          <div className="h-[2px] w-full bg-stone-100 rounded-full mb-12">
            <div className="h-full bg-stone-900 transition-all duration-700" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>

          <div className="bg-white p-12 rounded-[56px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] border border-stone-100 mb-10 text-center">
            <h3 className="text-2xl font-bold text-stone-800 leading-snug font-serif">
              {questions[currentIdx].question}
            </h3>
          </div>

          <div className="space-y-4 mb-12">
            {questions[currentIdx].options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(i)}
                disabled={answered !== null}
                className={`w-full p-6 rounded-[28px] border font-bold text-sm transition-all text-left flex items-center justify-between ${answered === null ? 'bg-white border-stone-100 hover:border-amber-400 text-stone-700' : (i === questions[currentIdx].correctIndex ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : (i === answered ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-stone-50 border-stone-50 opacity-30 text-stone-400'))}`}
              >
                <span>{opt}</span>
                {answered !== null && i === questions[currentIdx].correctIndex && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>

          {answered !== null && (
            <button onClick={nextQuestion} className="w-full bg-stone-900 text-amber-500 py-6 rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl animate-in slide-in-from-bottom-4 transition-all active:scale-95">
              {currentIdx === questions.length - 1 ? 'FINALIZAR' : 'PRÓXIMA'}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-stone-200">
          <p className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">Defina um tema para iniciar o desafio</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
