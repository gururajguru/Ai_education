import React, { useState, useContext, useEffect } from 'react';
import { LearningContext } from '../context/LearningContext';
import { UserContext } from '../context/UserContext';
import { 
  Bell, FileText, GraduationCap, Send, Trash2, CheckCircle, 
  Clock, Plus, ShieldAlert, Award, Search, UserPlus, Eye, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeacherDashboard() {
  const { user } = useContext(UserContext);
  const { 
    courses, 
    announcements, 
    assignments, 
    addAnnouncement, 
    addAssignment, 
    gradeSubmission 
  } = useContext(LearningContext);

  const [activeTab, setActiveTab] = useState('announcements');
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  
  const [asTitle, setAsTitle] = useState('');
  const [asDesc, setAsDesc] = useState('');
  const [asDueDate, setAsDueDate] = useState('');
  const [asCourseId, setAsCourseId] = useState(courses[0]?.id || 'c1');

  const [gradingScores, setGradingScores] = useState({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState({});
  const [selectedAsIdForGrading, setSelectedAsIdForGrading] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Student accounts creation states
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(null);

  const [regStudents, setRegStudents] = useState(() => {
    const saved = localStorage.getItem('registered_students');
    return saved ? JSON.parse(saved) : [];
  });

  // Save registered students list
  useEffect(() => {
    localStorage.setItem('registered_students', JSON.stringify(regStudents));
  }, [regStudents]);

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement(annTitle, annContent, `Dr. ${user.name}`);
    setAnnTitle('');
    setAnnContent('');
    
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#ec4899', '#10b981']
    });
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!asTitle.trim() || !asDesc.trim() || !asDueDate) return;

    addAssignment(asTitle, asDesc, asDueDate, asCourseId);
    setAsTitle('');
    setAsDesc('');
    setAsDueDate('');

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#3b82f6', '#8a2be2']
    });
  };

  const handleCommitGrade = (assignmentId, studentName) => {
    const key = `${assignmentId}-${studentName}`;
    const grade = gradingScores[key] || '95/100';
    const feedback = gradingFeedbacks[key] || 'Excellent analytical reasoning and code structures.';

    gradeSubmission(assignmentId, studentName, grade, feedback);
    
    // Clear individual inputs
    setGradingScores(prev => ({ ...prev, [key]: '' }));
    setGradingFeedbacks(prev => ({ ...prev, [key]: '' }));

    // Celebration
    confetti({
      particleCount: 30,
      spread: 30,
      origin: { y: 0.8 }
    });
  };

  // Add Dynamic Student Account & Password Generator
  const handleRegisterStudent = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) return;

    const emailNorm = studentEmail.toLowerCase().trim();
    // Prevent duplicate registrations
    if (regStudents.some(s => s.email.toLowerCase().trim() === emailNorm)) {
      alert('❌ A student with this email address is already registered.');
      return;
    }

    // Generate randomized secure password (e.g. EduPass-5831)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedPassword = `EduPass-${randomNum}`;

    const newStudent = {
      name: studentName.trim(),
      email: emailNorm,
      password: generatedPassword,
      role: 'Student',
      dateRegistered: new Date().toLocaleDateString()
    };

    setRegStudents(prev => [newStudent, ...prev]);
    setStudentName('');
    setStudentEmail('');

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });

    alert(`🎉 Account generated successfully!\n\nName: ${newStudent.name}\nEmail: ${newStudent.email}\nGenerated Password: ${newStudent.password}\n\nThe student can now log in using these credentials.`);
  };

  const handleDeleteStudent = (emailToDelete) => {
    if (window.confirm('Are you sure you want to delete this student account? They will lose access immediately.')) {
      setRegStudents(prev => prev.filter(s => s.email !== emailToDelete));
    }
  };

  const handleCopy = (text, emailKey) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(emailKey);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Merge standard mock students with dynamic teacher-registered students
  const MOCK_STUDENTS = [
    { name: 'ALEX H.', email: 'alex.h@learninguniverse.ai', retention: '92%', completed: '3/3', average: '94%', streak: '8 days', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' },
    { name: 'SOPHIA M.', email: 'sophia.m@learninguniverse.ai', retention: '88%', completed: '3/3', average: '91%', streak: '12 days', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80' },
    { name: 'MARCUS L.', email: 'marcus.l@learninguniverse.ai', retention: '78%', completed: '2/3', average: '82%', streak: '6 days', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80' },
    { name: 'CLARA D.', email: 'clara.d@learninguniverse.ai', retention: '95%', completed: '3/3', average: '96%', streak: '10 days', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' }
  ];

  const allStudents = [
    ...regStudents.map(s => ({
      name: s.name.toUpperCase(),
      email: s.email,
      retention: '85%',
      completed: '0/3',
      average: 'N/A',
      streak: '0 days',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${s.email}`
    })),
    ...MOCK_STUDENTS
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full text-slate-100">
      
      {/* Faculty Info Header */}
      <div className="glassmorphism p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full filter blur-xl animate-pulse-glow" />
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 shadow-neon-pink">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide uppercase">
              EDUCATOR CONSOLE
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Lecturer Portal: <strong className="text-rose-400 font-bold uppercase">Dr. {user.name}</strong> • Classroom Hub
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap bg-black/40 p-1 rounded-xl border border-white/5 gap-1 md:gap-0">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'announcements'
                ? 'bg-rose-500 text-white shadow-neon-pink'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'assignments'
                ? 'bg-rose-500 text-white shadow-neon-pink'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Assignments & Grading
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'students'
                ? 'bg-rose-500 text-white shadow-neon-pink'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Accounts
          </button>
          <button
            onClick={() => setActiveTab('gradebook')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'gradebook'
                ? 'bg-rose-500 text-white shadow-neon-pink'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Class Gradebook
          </button>
        </div>
      </div>

      {/* Main View Port */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tab: Announcements */}
        {activeTab === 'announcements' && (
          <>
            {/* Create Announcement Form */}
            <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Bell className="h-4.5 w-4.5 text-rose-400 animate-pulse" /> Post Classroom Announcement
              </h3>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Examination Schedule"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Announcement Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about schedules, exams, or homework assignments..."
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-xs font-black uppercase text-white tracking-widest shadow-neon-pink hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={13} /> Post Announcement
                </button>
              </form>
            </div>

            {/* Announcements Registry Feed */}
            <div className="lg:col-span-2 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Send className="h-4.5 w-4.5 text-rose-400 animate-pulse" /> Classroom Announcements Feed
              </h3>

              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-10 font-mono">No announcements posted yet.</p>
                ) : (
                  announcements.map((ann) => (
                    <div 
                      key={ann.id}
                      className="p-4 bg-white/0 border border-white/5 rounded-2xl hover:border-white/10 transition-all flex flex-col gap-3 relative group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-sm font-black text-rose-300 uppercase tracking-wide">{ann.title}</h4>
                          <span className="text-xs font-mono text-slate-500">{ann.date} • Sent by {ann.author}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{ann.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Tab: Assignments & Submissions */}
        {activeTab === 'assignments' && (
          <>
            {/* Deploy Assignments */}
            <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Plus className="h-4.5 w-4.5 text-rose-400" /> Create New Assignment
              </h3>

              <form onSubmit={handleCreateAssignment} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assignment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Analytical Reasoning Project"
                    value={asTitle}
                    onChange={(e) => setAsTitle(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Course</label>
                  <select
                    value={asCourseId}
                    onChange={(e) => setAsCourseId(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    required
                    value={asDueDate}
                    onChange={(e) => setAsDueDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assignment Guidelines</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write detailed instructions on what student homework coordinates need evaluation..."
                    value={asDesc}
                    onChange={(e) => setAsDesc(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-xs font-black uppercase text-white tracking-widest shadow-neon-pink hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={13} /> Post Assignment
                </button>
              </form>
            </div>

            {/* Interactive Grading Panel */}
            <div className="lg:col-span-2 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <FileText className="h-4.5 w-4.5 text-rose-400" /> Assignment Grading Portal
              </h3>

              {/* Assignment selector tabs */}
              <div className="flex gap-2 flex-wrap bg-black/30 p-1.5 rounded-xl border border-white/5">
                {assignments.map(as => {
                  const pendingCount = as.submissions.filter(s => s.grade === 'Pending').length;
                  return (
                    <button
                      key={as.id}
                      onClick={() => setSelectedAsIdForGrading(as.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        selectedAsIdForGrading === as.id || (selectedAsIdForGrading === null && as.id === assignments[0]?.id)
                          ? 'bg-rose-950/40 border border-rose-800 text-rose-300'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {as.title.substring(0, 20)}...
                      {pendingCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-xs font-black">{pendingCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected assignment details & grading feed */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {(() => {
                  const activeAsId = selectedAsIdForGrading || assignments[0]?.id;
                  const activeAs = assignments.find(a => a.id === activeAsId);
                  if (!activeAs) return <p className="text-xs text-slate-500 text-center py-10 font-mono">No active assignment selected.</p>;

                  return (
                    <div className="space-y-4">
                      {/* Short Description */}
                      <div className="p-3 bg-black/20 border border-white/5 rounded-xl text-xs leading-relaxed text-slate-400 text-left">
                        <strong className="text-slate-300 block mb-1">Target Description:</strong>
                        {activeAs.description}
                      </div>

                      {/* Submissions items */}
                      {activeAs.submissions.length === 0 ? (
                         <p className="text-xs text-slate-500 text-center py-10 font-mono">No student submissions detected yet.</p>
                      ) : (
                        activeAs.submissions.map((sub, sIdx) => {
                          const key = `${activeAs.id}-${sub.studentName}`;
                          const isGraded = sub.grade !== 'Pending';

                          return (
                            <div 
                              key={sIdx}
                              className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3.5 relative"
                            >
                              {/* Header info */}
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs text-white">
                                    {sub.studentName.substring(0, 2)}
                                  </div>
                                  <span className="text-xs font-black text-slate-200">{sub.studentName}</span>
                                </div>
                                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                  isGraded ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-amber-950/40 border-amber-900/50 text-amber-400'
                                }`}>
                                  {sub.grade}
                                </span>
                              </div>

                              {/* Student Text Work */}
                              <div className="p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-cyan-200 leading-relaxed text-left">
                                {sub.content}
                              </div>

                              {/* Grading Form or Completed box */}
                              {isGraded ? (
                                <div className="p-3 rounded-xl bg-emerald-950/10 border border-emerald-900/30 space-y-1 text-left">
                                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle size={10} /> Evaluated & Graded Feedback
                                  </span>
                                  <p className="text-xs text-emerald-100 font-sans leading-relaxed">{sub.feedback}</p>
                                </div>
                              ) : (
                                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-left">
                                  <span className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={10} className="animate-pulse" /> Awaiting Evaluation
                                  </span>
                                  <div className="grid grid-cols-4 gap-3.5">
                                    <div className="col-span-1">
                                      <input
                                        type="text"
                                        placeholder="e.g. 95/100"
                                        value={gradingScores[key] || ''}
                                        onChange={(e) => setGradingScores(prev => ({ ...prev, [key]: e.target.value }))}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400 font-mono font-black"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <input
                                        type="text"
                                        placeholder="Add written critique or evaluation tips..."
                                        value={gradingFeedbacks[key] || ''}
                                        onChange={(e) => setGradingFeedbacks(prev => ({ ...prev, [key]: e.target.value }))}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleCommitGrade(activeAs.id, sub.studentName)}
                                    className="w-full py-1.5 bg-rose-950/40 border border-rose-900 hover:bg-rose-950 text-rose-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                  >
                                    Commit Grade & Feedback
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </>
        )}

        {/* Tab: Student Accounts Generation (Teacher adds Student and generates ID and Password) */}
        {activeTab === 'students' && (
          <>
            {/* Left Registration Form */}
            <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <UserPlus className="h-4.5 w-4.5 text-rose-400" /> Register New Student
              </h3>

              <form onSubmit={handleRegisterStudent} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@school.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400 font-medium"
                  />
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400 leading-relaxed">
                  <span className="font-bold text-rose-300 block mb-0.5">🔒 Automated Security Handshake:</span>
                  The system will automatically generate a secure credentials card and random password starting with <code className="text-rose-400 font-mono">EduPass-</code> for the student account.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-xs font-black uppercase text-white tracking-widest shadow-neon-pink hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={13} /> Generate Account & Pass
                </button>
              </form>
            </div>

            {/* Right Registered Students Ledger */}
            <div className="lg:col-span-2 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Award className="h-4.5 w-4.5 text-rose-400 animate-pulse" /> Student Credentials Ledger
              </h3>

              <div className="overflow-x-auto w-full max-h-[380px] overflow-y-auto">
                {regStudents.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-12 font-mono">No custom student accounts generated yet. Use the registration form to create one.</p>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">User ID (Email)</th>
                        <th className="py-2.5 px-3">Access Password</th>
                        <th className="py-2.5 px-3">Date Registered</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {regStudents.map((stud, idx) => (
                        <tr key={idx} className="hover:bg-white/2 transition-colors text-xs font-semibold text-slate-300">
                          <td className="py-3 px-3 uppercase text-slate-200 font-bold">{stud.name}</td>
                          <td className="py-3 px-3 font-mono text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span>{stud.email}</span>
                              <button 
                                onClick={() => handleCopy(stud.email, stud.email + '-email')}
                                className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                                title="Copy Email ID"
                              >
                                {copiedEmail === stud.email + '-email' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-300 font-extrabold">
                            <div className="flex items-center gap-1.5">
                              <span>{stud.password}</span>
                              <button 
                                onClick={() => handleCopy(stud.password, stud.email + '-pass')}
                                className="text-slate-500 hover:text-cyan-400 p-0.5 transition-colors"
                                title="Copy Password"
                              >
                                {copiedEmail === stud.email + '-pass' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-mono">{stud.dateRegistered}</td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleDeleteStudent(stud.email)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="p-3 bg-rose-950/15 border border-rose-900/30 rounded-xl flex gap-2 text-xs font-mono text-rose-400 leading-relaxed mt-2 text-left">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 animate-pulse" />
                <span>Generated students are instantly cached in secure local storage. Students can immediately log in using their email and password from the main login screen.</span>
              </div>
            </div>
          </>
        )}

        {/* Tab: Class Gradebook */}
        {activeTab === 'gradebook' && (
          <div className="lg:col-span-3 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 flex-wrap gap-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-rose-400 animate-bounce" /> Classroom Gradebook
              </h3>
              
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter student registry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <th className="py-3 px-4">Student Profile</th>
                    <th className="py-3 px-4">Retention Rate</th>
                    <th className="py-3 px-4">Completed Tasks</th>
                    <th className="py-3 px-4">Average Score</th>
                    <th className="py-3 px-4">Daily Streak</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((stud, idx) => (
                      <tr key={idx} className="hover:bg-white/2 transition-colors text-xs font-semibold text-slate-300">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img src={stud.avatar} alt={stud.name} className="h-7 w-7 rounded-full object-cover border border-white/10 shrink-0" />
                          <div>
                            <p className="text-xs font-black text-slate-100 uppercase">{stud.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{stud.email}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-cyan-400">
                          {stud.retention}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {stud.completed}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400">
                          {stud.average}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-400">
                          🔥 {stud.streak}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-mono px-2 py-0.5 rounded border bg-rose-950/40 border-rose-800 text-rose-400 uppercase tracking-wider">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-rose-950/15 border border-rose-900/30 rounded-xl flex gap-2 text-xs font-mono text-rose-400 leading-relaxed mt-2 text-left">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 animate-pulse" />
              <span>The gradebook tracks students' academic averages, daily assignment streak, and lesson completion rates. Custom registered accounts are dynamically displayed above.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
