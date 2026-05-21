import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Award, Sparkles, BookOpen, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Quiz() {
  const { addXP, unlockBadge } = useContext(UserContext);

  const [topic, setTopic] = useState('Neural Networks');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleStartQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
      // Fallback local fail-safe quiz questions handled gracefully
      setQuestions([
        {
          question: `Which formula represents standard weight optimization update steps?`,
          options: [
            "W_new = W_old - η * ∇C",
            "F = m * a",
            "E = mc²",
            "W_new = W_old + η * ∇C"
          ],
          answerIndex: 0,
          explanation: "Optimization in neural networks commonly subtracts the product of the learning rate and loss gradient to update weight balances."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === questions[currentIndex].answerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXP(100); // 100 XP for correct adaptive quiz question
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Confetti splash for high performance
      const finalPercentage = (score / questions.length) * 100;
      if (finalPercentage >= 80) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      if (finalPercentage === 100) {
        unlockBadge('4'); // Unlock Quiz Master badge
      }
    }
  };

  const activeQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Quiz setup panel */}
      {!loading && questions.length === 0 && (
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 rounded-full filter blur-xl animate-pulse-glow" />
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="h-5 w-5 text-amber-400 animate-bounce" />
            <span className="text-sm font-bold tracking-wider text-slate-200">ADAPTIVE QUIZ SETUP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Neural Networks">🧠 Artificial Neural Networks</option>
                <option value="Quantum Computing">⚛️ Modern Quantum Computing</option>
                <option value="Edge Architectures">🌐 Edge Web Technologies</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pedagogical Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Easy">Beginner (Easy)</option>
                <option value="Medium">Intermediate (Medium)</option>
                <option value="Hard">Advanced (Hard)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl text-xs font-black uppercase text-white tracking-widest shadow-neon-cyan hover:opacity-90 transition-opacity"
          >
            Launch Cyber Quiz
          </button>
        </div>
      )}

      {/* Loading state indicator */}
      {loading && (
        <div className="glassmorphism p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="h-10 w-10 border-t-2 border-r-2 border-amber-400 rounded-full animate-spin" />
          <p className="text-xs font-mono text-amber-300 tracking-widest uppercase">AI generating custom adaptive question matrices...</p>
        </div>
      )}

      {/* Question rendering dashboard */}
      {!loading && questions.length > 0 && !quizFinished && (
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-6 relative">
          
          {/* Header metrics */}
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Topic: {topic} ({difficulty})
            </span>
            <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Question text */}
          <h3 className="text-sm md:text-base font-bold text-slate-100 leading-relaxed font-sans">
            {activeQ.question}
          </h3>

          {/* Choices list */}
          <div className="space-y-2.5">
            {activeQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const showResult = isAnswered;
              const isCorrectOpt = activeQ.answerIndex === idx;

              let borderClass = 'border-white/10 hover:border-white/20 bg-white/0';
              if (isSelected) borderClass = 'border-amber-400 shadow-neon-purple bg-amber-950/10';
              
              if (showResult) {
                if (isCorrectOpt) borderClass = 'border-emerald-500 bg-emerald-950/20 text-emerald-200 shadow-neon-green';
                else if (isSelected) borderClass = 'border-rose-500 bg-rose-950/20 text-rose-200 shadow-neon-pink';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-semibold leading-relaxed flex justify-between items-center transition-all ${borderClass}`}
                  disabled={isAnswered}
                >
                  <span>{opt}</span>
                  {showResult && isCorrectOpt && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 ml-2 animate-bounce" />}
                </button>
              );
            })}
          </div>

          {/* Submission and explanations details */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
            
            {/* Explanation box */}
            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 animate-in fade-in duration-300 flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">AI Explanation</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeQ.explanation}</p>
                </div>
              </div>
            )}

            {!isAnswered ? (
              <button
                onClick={handleVerifyAnswer}
                disabled={selectedOption === null}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold uppercase text-white tracking-wider disabled:opacity-50 transition-opacity"
              >
                Verify Option Selection
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase hover:bg-white/10 text-white tracking-wider transition-colors"
              >
                {currentIndex + 1 < questions.length ? 'Next Dimension' : 'Synthesize Final Score'}
              </button>
            )}

          </div>

        </div>
      )}

      {/* Finished scoreboard screen */}
      {!loading && quizFinished && (
        <div className="glassmorphism p-8 rounded-3xl border border-white/5 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full filter blur-xl animate-pulse-glow" />
          <Award className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
          
          <div>
            <h2 className="text-2xl font-black uppercase text-white tracking-wide">Test Synthesized</h2>
            <p className="text-xs text-slate-400 mt-1">Pedagogical data parsed. Scores locked.</p>
          </div>

          <div className="inline-block p-5 rounded-2xl bg-slate-900 border border-white/5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Mastery Rating</p>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-xs font-bold uppercase text-white tracking-wider shadow-neon-green hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RefreshCw size={13} /> Re-Launch Quiz
          </button>
        </div>
      )}

    </div>
  );
}
