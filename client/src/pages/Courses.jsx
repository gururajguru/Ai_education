import React, { useContext, useState } from 'react';
import { LearningContext } from '../context/LearningContext';
import { UserContext } from '../context/UserContext';
import { BookOpen, Sparkles, AlertCircle, FileText, CheckSquare, Square } from 'lucide-react';

export default function Courses() {
  const { courses, markLessonComplete, assignments, submitAssignment } = useContext(LearningContext);
  const { user, addXP } = useContext(UserContext);

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState('');
  const [solutionTexts, setSolutionTexts] = useState({});
 
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseAssignments = assignments ? assignments.filter(as => as.courseId === activeCourse.id) : [];

  const handleSubmitWork = (asId) => {
    const text = solutionTexts[asId];
    if (!text || !text.trim()) return;

    submitAssignment(asId, user.name || 'YOU', text);
    setSolutionTexts(prev => ({ ...prev, [asId]: '' }));
    addXP(100);

    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const handleSummarize = async (lessonContent) => {
    setLoadingSummary(true);
    setSummaryResult('');
    addXP(15); // reward summary requests

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: lessonContent,
          format: 'bullet-points'
        })
      });
      const data = await response.json();
      setSummaryResult(data.summary);
    } catch (err) {
      console.error(err);
      setSummaryResult(`🛰️ **Mock AI Summary fallback**:
- **Subject matter**: Edge frameworks, deep mathematical representations, or physics state dimensions.
- **Key formula**: Multi-layer weight adjustments minimize generalized loss curves dynamically.
- **Study reminder**: Practice standard quiz evaluations to solidify concept mappings. Add a \`GEMINI_API_KEY\` to your server env to enable real-time Gemini summaries!`);
    } finally {
      setLoadingSummary(false);
    }
  };

  const difficultyColors = {
    'Easy': 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400',
    'Medium': 'bg-cyan-950/40 border-cyan-900/50 text-cyan-400',
    'Hard': 'bg-rose-950/40 border-rose-900/50 text-rose-400 animate-pulse'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* Left panel: Courses directory */}
      <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <BookOpen className="h-5 w-5 text-primaryGlow" />
          <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">SUBJECT DIRECTORY</span>
        </div>

        <div className="space-y-3">
          {courses.map((course) => {
            const isActive = course.id === selectedCourseId;
            return (
              <button
                key={course.id}
                onClick={() => { setSelectedCourseId(course.id); setSummaryResult(''); }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? 'bg-gradient-to-r from-neonPurple/20 to-cyan-950/20 border-primaryGlow shadow-neon-cyan' 
                    : 'bg-white/0 border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${difficultyColors[course.difficulty]}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">{course.progress}% Completed</span>
                </div>

                <h4 className="text-xs font-black text-slate-100 mt-2.5 group-hover:text-primaryGlow transition-colors duration-250 uppercase leading-snug">
                  {course.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {course.summary}
                </p>

                {/* Progress bar graph */}
                <div className="w-full h-1 bg-white/5 mt-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primaryGlow to-neonPurple transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel: Course Lessons checklists & AI Summarizer */}
      {activeCourse ? (
        <div className="lg:col-span-2 space-y-6">
          
          {/* Lessons list card */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">{activeCourse.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore curriculum lessons. Click checkbox to toggle completed state.</p>
            </div>

            <div className="space-y-3">
              {activeCourse.lessons.map((lesson) => {
                const isCompleted = lesson.completed;
                return (
                  <div 
                    key={lesson.id} 
                    className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                      isCompleted ? 'bg-emerald-950/5 border-emerald-900/30' : 'bg-black/20 border-white/5'
                    }`}
                  >
                    {/* Lesson Checkbox */}
                    <button 
                      onClick={() => { markLessonComplete(activeCourse.id, lesson.id); addXP(60); }}
                      className={`p-1 rounded-lg border shrink-0 transition-colors ${
                        isCompleted ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>

                    {/* Lesson Text */}
                    <div className="space-y-1 flex-1">
                      <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-300 line-through' : 'text-slate-100'}`}>
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1 select-text">
                        {lesson.content}
                      </p>

                      {/* Summarize button option */}
                      <button
                        onClick={() => handleSummarize(lesson.content)}
                        className="text-xs text-cyan-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1 mt-2.5"
                      >
                        <Sparkles size={10} /> Summarize Lesson via AI
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Summarizer result console */}
          {(loadingSummary || summaryResult) && (
            <div className="glassmorphism p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-950/20 to-black/20 flex flex-col gap-3.5 relative overflow-hidden animate-in fade-in duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full filter blur-xl animate-pulse-glow" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" /> AI Summarizer Console
                </span>
                <span className="text-xs font-mono text-slate-500">Model: Gemini-1.5-Flash</span>
              </div>

              {loadingSummary ? (
                <div className="py-4 flex items-center justify-center gap-2 animate-pulse text-xs text-cyan-300 font-mono">
                  <div className="h-4 w-4 border-t-2 border-primaryGlow rounded-full animate-spin" />
                  <span>Transcribing bullet summary guidelines...</span>
                </div>
              ) : (
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-3 items-start select-text">
                  <FileText className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-relaxed font-mono space-y-1">
                    {summaryResult.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Assignments Hub */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 font-sans">
              <FileText className="h-4.5 w-4.5 text-rose-400" /> Active Curricular Assignments
            </h3>
            
            <div className="space-y-4">
              {courseAssignments.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6 font-mono">No active assignment tasks published for this course.</p>
              ) : (
                courseAssignments.map((as) => {
                  const mySub = as.submissions.find(s => s.studentName.toUpperCase() === user.name.toUpperCase());
                  const isSubmitted = !!mySub;

                  return (
                    <div key={as.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3 relative group">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                          <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">{as.title}</h4>
                          <span className="text-xs font-mono text-slate-500">Due Date: {as.dueDate}</span>
                        </div>
                        {isSubmitted ? (
                          <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            mySub.grade !== 'Pending' ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-cyan-950/40 border-cyan-900/50 text-cyan-400'
                          }`}>
                            {mySub.grade !== 'Pending' ? `Graded: ${mySub.grade}` : 'Awaiting Grade'}
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded border bg-rose-950/40 border-rose-900/50 text-rose-400 uppercase tracking-wider animate-pulse">
                            Action Required
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{as.description}</p>

                      {isSubmitted ? (
                        <div className="space-y-2 mt-2 pt-2 border-t border-white/5">
                          <div className="p-2.5 bg-black/50 border border-white/5 rounded-xl text-xs font-mono text-cyan-200 leading-normal">
                            <span className="text-xs text-slate-500 font-bold block mb-0.5 uppercase">Your Submission:</span>
                            {mySub.content}
                          </div>
                          {mySub.grade !== 'Pending' && (
                            <div className="p-2.5 bg-emerald-950/10 border border-emerald-900/20 rounded-xl text-xs text-emerald-300 leading-normal font-sans">
                              <span className="text-xs text-emerald-500 font-bold block mb-0.5 uppercase">Faculty Feedback:</span>
                              {mySub.feedback}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 mt-2 pt-2 border-t border-white/5">
                          <textarea
                            rows={3}
                            placeholder="Type your structured solution equations or code implementation..."
                            value={solutionTexts[as.id] || ''}
                            onChange={(e) => setSolutionTexts(prev => ({ ...prev, [as.id]: e.target.value }))}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 resize-none leading-relaxed"
                          />
                          <button
                            onClick={() => handleSubmitWork(as.id)}
                            className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-xs font-extrabold uppercase text-white tracking-widest shadow-neon-pink hover:opacity-95"
                          >
                            Commit Submission Coordinates
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="lg:col-span-2 glassmorphism rounded-2xl flex items-center justify-center py-20 text-slate-500">
          Please select a subject path to continue.
        </div>
      )}

    </div>
  );
}
