import React, { useState, useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import { UserContext } from '../context/UserContext';
import { Calendar, PlusCircle, CheckSquare, Square, Trash2, CalendarRange, Clock } from 'lucide-react';

export default function Planner() {
  const { planner, addPlannerTask, togglePlannerTask, deletePlannerTask } = useContext(LearningContext);
  const { addXP } = useContext(UserContext);

  const [newTask, setNewTask] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newDuration, setNewDuration] = useState(30);

  // Roadmap Generator States
  const [examDate, setExamDate] = useState('2026-06-15');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    addPlannerTask({
      task: newTask,
      date: 'Today',
      difficulty: newDifficulty,
      duration: newDuration
    });
    setNewTask('');
    addXP(10);
  };

  const handleGenerateRoadmap = () => {
    setLoadingRoadmap(true);
    setGeneratedRoadmap(null);
    addXP(25);

    setTimeout(() => {
      // Formulate detailed target exam checkpoints dynamically
      setGeneratedRoadmap([
        { phase: 'Phase 1: Diagnostic Lock (Week 1)', description: `Study fundamental axioms for 2 hours daily. Re-read Perceptron weight backpropagations.` },
        { phase: 'Phase 2: Core Deepening (Week 2)', description: `Solve 4 dynamic intermediate-level adaptive quizzes daily. Maximize attention metrics above 85% during lessons.` },
        { phase: 'Phase 3: High-Stress Sim (Week 3)', description: `Activate webcam scan in quiz dashboard. Perform 3 back-to-back mock quizzes under simulated exam conditions.` },
        { phase: 'Phase 4: Revision & Memory maps (Final Days)', description: `Complete remaining incomplete courses checklists. Review AI-generated flashcards 30 mins every morning.` }
      ]);
      setLoadingRoadmap(false);
    }, 1200);
  };

  const diffColors = {
    'Easy': 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400',
    'Medium': 'bg-cyan-950/40 border-cyan-900/50 text-cyan-400',
    'Hard': 'bg-rose-950/40 border-rose-900/50 text-rose-400'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* Left panel: Daily Task Planner */}
      <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Calendar className="h-5 w-5 text-primaryGlow" />
          <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">STUDY TARGETS</span>
        </div>

        {/* Task lists checklist */}
        <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none">
          {planner.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Your calendar checklist is clear! Enjoy the break.</p>
          ) : (
            planner.map((item) => {
              const isCompleted = item.completed;
              return (
                <div 
                  key={item.id}
                  className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                    isCompleted ? 'bg-white/0 border-transparent text-slate-500' : 'bg-black/20 border-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => { togglePlannerTask(item.id); addXP(30); }}
                      className={`p-1.5 rounded-lg border shrink-0 transition-colors ${
                        isCompleted ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                    <div>
                      <p className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.task}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-mono font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${diffColors[item.difficulty]}`}>
                          {item.difficulty}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-0.5"><Clock size={8} /> {item.duration} Mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deletePlannerTask(item.id)}
                    className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Append Task Form */}
        <form onSubmit={handleCreateTask} className="border-t border-white/10 pt-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Study Goal</label>
            <input 
              type="text"
              required
              placeholder="e.g. Read Superposition lesson"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mins</label>
              <input 
                type="number"
                required
                min={5}
                max={240}
                value={newDuration}
                onChange={(e) => setNewDuration(parseInt(e.target.value))}
                className="w-full mt-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-cyan-950/40 border border-cyan-800 text-cyan-400 font-bold uppercase tracking-wider rounded-xl text-xs hover:bg-cyan-950 transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle size={12} /> Add Target Task
          </button>
        </form>
      </div>

      {/* Right panel: Exam Roadmap generator */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Roadmap Setup card */}
        <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-400/5 rounded-full filter blur-xl animate-pulse-glow" />
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <CalendarRange className="h-5 w-5 text-rose-400" />
            <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">AI EXAM ROADMAP GENERATOR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Exam Date</label>
              <input 
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weekly Focus Hours / Day</label>
              <input 
                type="number"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl text-xs font-black uppercase text-white tracking-wider shadow-neon-purple hover:opacity-90 transition-opacity"
            disabled={loadingRoadmap}
          >
            {loadingRoadmap ? 'Synthesizing Roadmap Parameters...' : 'Generate AI Study Roadmap'}
          </button>
        </div>

        {/* Roadmap Display console */}
        {generatedRoadmap && (
          <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {generatedRoadmap.map((item, i) => (
              <div 
                key={i}
                className="p-4 rounded-2xl glassmorphism border border-white/5 flex gap-4 hover:border-rose-500/20 transition-all duration-200"
              >
                <div className="h-8 w-8 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wide">{item.phase}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
