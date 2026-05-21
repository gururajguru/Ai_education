import React, { useState, useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import { ChevronLeft, ChevronRight, PlusCircle, HelpCircle, Eye, Sparkles, RefreshCw } from 'lucide-react';

export default function FlashcardDeck() {
  const { flashcards, addFlashcard, deleteFlashcard } = useContext(LearningContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formMode, setFormMode] = useState('ai'); // 'ai' or 'manual'
  const [aiTopic, setAiTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const activeCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;
    addFlashcard({
      question: newQuestion,
      answer: newAnswer,
      category: newCategory || 'General'
    });
    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('');
    setShowAddForm(false);
    setCurrentIndex(0); // View new card immediately
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiTopic) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic })
      });
      if (response.ok) {
        const newCards = await response.json();
        if (Array.isArray(newCards) && newCards.length > 0) {
          newCards.forEach(card => {
            addFlashcard({
              question: card.question,
              answer: card.answer,
              category: card.category || aiTopic
            });
          });
          setAiTopic('');
          setShowAddForm(false);
          setCurrentIndex(0); // Jump to first card in deck
        }
      }
    } catch (err) {
      console.error('Error generating AI flashcards:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primaryGlow" />
          <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">Interactive Flashcards</span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs text-neonPink border border-neonPink/30 px-2.5 py-1 rounded-lg hover:bg-neonPink/10 transition-colors duration-200 flex items-center gap-1"
        >
          <PlusCircle size={12} /> {showAddForm ? 'View Cards' : 'Create Custom Card'}
        </button>
      </div>

      {showAddForm ? (
        /* Create Card Container */
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Form Mode Selector Toggles */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setFormMode('ai')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                formMode === 'ai' 
                  ? 'bg-gradient-to-r from-neonPink to-purple-600 text-white shadow-neon-pink' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={12} /> AI Synthesizer
            </button>
            <button
              onClick={() => setFormMode('manual')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                formMode === 'manual' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle size={12} /> Manual Entry
            </button>
          </div>

          {formMode === 'ai' ? (
            /* AI Generation Form */
            <form onSubmit={handleAiGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">AI Subject Topic</label>
                <input
                  type="text"
                  required
                  disabled={generating}
                  placeholder="e.g. Backpropagation gradients, Bloch spheres, WebRTC ICE candidates"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-neonPink transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 bg-gradient-to-r from-neonPink to-purple-600 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-neon-pink hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin text-white" /> Synthesizing Memory Deck...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="text-white" /> Synthesize 3 Memory Cards
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Manual Create Form */
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Question Prompt</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is gradient descent?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-neonPink transition-colors duration-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Answer Details</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Provide a concise summary explanation..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-neonPink transition-colors duration-200 resize-none animate-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Subject Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Physics, Coding"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-neonPink transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-neonPink to-purple-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-neon-pink hover:opacity-90 transition-opacity"
              >
                Create Memory Card
              </button>
            </form>
          )}
        </div>
      ) : flashcards.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-10">No flashcards currently in the deck. Create one now!</p>
      ) : (
        /* 3D Flashcard Deck Renderer */
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full aspect-[16/10] perspective-1000 cursor-pointer relative group"
          >
            {/* Flippable Card body */}
            <div 
              className={`w-full h-full duration-500 transform-style-3d relative rounded-2xl border transition-all ${
                isFlipped ? 'rotate-y-180 border-primaryGlow shadow-neon-cyan' : 'border-neonPurple shadow-neon-purple'
              }`}
            >
              {/* CARD FRONT */}
              <div className="absolute inset-0 backface-hidden glassmorphism rounded-2xl p-6 flex flex-col justify-between items-center text-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  Category: {activeCard.category}
                </span>
                <p className="font-semibold text-sm md:text-base leading-relaxed text-slate-100 px-4">
                  {activeCard.question}
                </p>
                <span className="text-xs text-neonPurple/80 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <Eye size={12} /> Click Card to reveal Answer
                </span>
              </div>

              {/* CARD BACK */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-950/90 to-black rounded-2xl p-6 flex flex-col justify-between items-center text-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-900 px-2 py-0.5 rounded">
                  Solution Unlocked
                </span>
                <p className="text-xs md:text-sm leading-relaxed text-cyan-100 px-4">
                  {activeCard.answer}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlashcard(activeCard.id);
                    setCurrentIndex(0);
                  }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-200 transition-colors uppercase hover:underline"
                >
                  Delete Card
                </button>
              </div>

            </div>
          </div>

          {/* Cards controls */}
          <div className="flex items-center justify-between px-2 mt-2">
            <button 
              onClick={handlePrev}
              className="p-1.5 rounded-lg glassmorphism-light hover:text-primaryGlow transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <button 
              onClick={handleNext}
              className="p-1.5 rounded-lg glassmorphism-light hover:text-primaryGlow transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
