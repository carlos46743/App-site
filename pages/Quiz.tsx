
import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { QuizQuestion } from '../types';

interface QuizProps {
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setQuestions(DB.getQuiz());
  }, []);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setAnswered(null);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setAnswered(null);
    setIsFinished(false);
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    return (
      <div className="p-6 text-center animate-in zoom-in duration-300">
        <header className="flex justify-start mb-10">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400">←</button>
        </header>
        <div className="bg-white rounded-[40px] p-10 shadow-lg mt-10">
          <span className="text-6xl block mb-6">🏆</span>
          <h2 className="text-3xl font-bold text-stone-800 mb-2">Quiz Concluído!</h2>
          <p className="text-stone-500 mb-8">Você acertou {score} de {questions.length} perguntas.</p>
          <div className="text-5xl font-bold text-amber-600 mb-10">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <button 
            onClick={restart}
            className="w-full bg-amber-600 text-white py-4 rounded-full font-bold shadow-lg hover:bg-amber-700 transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400">←</button>
        <div className="bg-white px-4 py-1 rounded-full text-xs font-bold text-stone-500 shadow-sm">
          QUESTÃO {currentIdx + 1}/{questions.length}
        </div>
        <div className="w-10"></div>
      </header>

      <div className="h-1.5 w-full bg-stone-200 rounded-full mb-10 overflow-hidden shadow-inner">
        <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[40px] shadow-sm mb-8 border border-white">
        <h3 className="text-xl font-bold text-stone-800 text-center leading-relaxed">
          {q.question}
        </h3>
      </div>

      <div className="space-y-3 mb-8">
        {q.options.map((opt, i) => {
          let styles = "bg-white text-stone-700 border-stone-100";
          if (answered !== null) {
            if (i === q.correctIndex) styles = "bg-green-100 text-green-800 border-green-200";
            else if (i === answered) styles = "bg-red-100 text-red-800 border-red-200";
            else styles = "bg-stone-50 text-stone-300 border-transparent opacity-60";
          }
          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(i)}
              disabled={answered !== null}
              className={`w-full p-5 rounded-[24px] border-2 font-medium text-left transition-all ${styles} ${answered === null && 'hover:border-amber-400 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {answered !== null && i === q.correctIndex && <span>✅</span>}
                {answered !== null && i === answered && i !== q.correctIndex && <span>❌</span>}
              </div>
            </button>
          );
        })}
      </div>

      {answered !== null && (
        <button 
          onClick={nextQuestion}
          className="w-full bg-stone-900 text-white py-5 rounded-full font-bold animate-in fade-in slide-in-from-bottom duration-300 shadow-lg"
        >
          {currentIdx === questions.length - 1 ? 'Ver Resultado Final' : 'Próxima Pergunta →'}
        </button>
      )}
    </div>
  );
};

export default Quiz;
