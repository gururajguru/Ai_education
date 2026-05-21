import React, { useState, useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import { UserContext } from '../context/UserContext';
import { Users2, Send, Plus, Award, Activity } from 'lucide-react';

export default function StudyRoom() {
  const { studyRooms, sendMessageToRoom, createStudyRoom, addXP } = useContext(LearningContext);
  const { user } = useContext(UserContext);

  const [activeRoomId, setActiveRoomId] = useState(studyRooms[0]?.id || '');
  const [newMsg, setNewMsg] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedRoom = studyRooms.find(r => r.id === activeRoomId) || studyRooms[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedRoom) return;

    sendMessageToRoom(selectedRoom.id, newMsg, user.name);
    addXP(15); // Earn XP for participating in collaboration
    const userMsg = newMsg.toLowerCase();
    setNewMsg('');

    // Trigger mock interactive student responses to feel alive
    setTimeout(() => {
      let peerReply = '';
      if (userMsg.includes('perceptron') || userMsg.includes('network') || userMsg.includes('learning')) {
        peerReply = 'Nice point! Neural weights adjustments are definitely challenging. Let\'s generate a smart study planner revision roadmap next!';
      } else if (userMsg.includes('quiz') || userMsg.includes('stuck') || userMsg.includes('hard')) {
        peerReply = 'I just completed the quiz in Fast Learner mode. Try toggling down to Beginner Mode to review the basic equations first!';
      } else {
        peerReply = 'Let\'s focus and keep the daily streak burning! We are scoring top ranks on the global leaderboards.';
      }
      sendMessageToRoom(selectedRoom.id, peerReply, 'Sophia M.');
    }, 2500);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    createStudyRoom(newRoomName);
    setNewRoomName('');
    setShowAddForm(false);
    addXP(40);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Rooms List panel */}
      <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-primaryGlow animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">CO-WORKING CHANNELS</span>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 rounded-lg glassmorphism-light hover:text-cyan-400 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {showAddForm ? (
          <form onSubmit={handleCreateRoom} className="space-y-3 animate-in fade-in duration-200">
            <input 
              type="text"
              required
              placeholder="e.g. Quantum Qubits Study Room"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-cyan-950/40 border border-cyan-800 text-cyan-400 font-bold uppercase tracking-wider rounded-xl text-xs hover:bg-cyan-950 transition-colors"
            >
              Establish Channel
            </button>
          </form>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none">
            {studyRooms.map((room) => {
              const isActive = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full flex justify-between items-center p-3 rounded-xl border text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-neonPurple/20 to-cyan-950/20 border-cyan-500/50 shadow-neon-cyan' 
                      : 'bg-white/0 border-transparent text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{room.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{room.activeUsers.length} Holographic Peers active</p>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-900/50 rounded">
                    {room.productivity}% Focus
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Chat and Group analytics */}
      {selectedRoom ? (
        <div className="lg:col-span-2 glassmorphism rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[500px]">
          
          {/* Header information */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30">
            <div>
              <h3 className="font-bold text-sm text-slate-100">{selectedRoom.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Activity size={10} className="text-cyan-400 animate-pulse" /> AI monitored study room
              </p>
            </div>
            {/* Holographic avatars displaying status */}
            <div className="flex -space-x-2">
              {selectedRoom.activeUsers.map((u, i) => (
                <div key={i} className="relative group cursor-help">
                  <img 
                    src={u.avatar} 
                    alt={u.name} 
                    className="h-7 w-7 rounded-full object-cover border border-white/20 hover:scale-110 transition-transform" 
                  />
                  <div className="absolute right-0 bottom-8 scale-0 group-hover:scale-100 transition-transform duration-200 bg-black border border-white/10 text-xs px-2 py-1 rounded text-white whitespace-nowrap z-50">
                    {u.name} ({u.status})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-black/10">
            {selectedRoom.messages.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-10">Welcome to the study channel. Start the conversation!</p>
            ) : (
              selectedRoom.messages.map((m) => {
                const isMe = m.sender === user.name;
                return (
                  <div 
                    key={m.id}
                    className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wide">{m.sender}</span>
                      <span className="text-xs text-slate-500">{m.time}</span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                      isMe 
                        ? 'bg-gradient-to-br from-neonPurple/20 to-indigo-950/20 border-neonPurple/30 text-white rounded-tr-none' 
                        : 'bg-white/5 border-white/5 text-slate-200 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Submission Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
            <input 
              type="text"
              required
              placeholder="Send coordinate message to study channel..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button 
              type="submit"
              className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-900 transition-all shadow-neon-cyan shrink-0"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      ) : (
        <div className="lg:col-span-2 glassmorphism rounded-2xl flex items-center justify-center py-20 text-slate-500">
          Select or establish a co-working channel to begin.
        </div>
      )}
    </div>
  );
}
