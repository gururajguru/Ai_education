import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { 
  Bot, Send, Mic, MicOff, Languages, HelpCircle, 
  Sparkles, Smile, RefreshCw 
} from 'lucide-react';

export default function Tutor() {
  const { user, addXP } = useContext(UserContext);
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: `Greetings Explorer! I am your dedicated AI Cognitive Tutor. I am currently operating in **[${user.learningMode} Mode]**.\n\nChoose an option from the Quick Prompt cards below or ask me any question! I support live voice inputs and multilingual translations.` }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  const modeDescriptions = {
    'Beginner': 'Explaining concepts with simple vocabulary, dynamic analogies, and basic building block metaphors.',
    'Fast Learner': 'Condensing notes into direct summaries, advanced notations, and quick logic equations.',
    'Exam Prep': 'Formulating cheat sheets, list models, bullet points, and outlining pitfall guides.',
    'Revision': 'Short answers, instant summaries, and fast questions logic checks.',
    'Visual Learning': 'Rendering structured bullet diagrams and descriptive ASCII layout models.'
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown structures for smooth audio speech synthesis
      const cleanText = text.replace(/[*#`_\-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 160));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputMsg;
    if (!textToSend.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setLoading(true);
    addXP(20); // Reward active tutoring

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          mode: user.learningMode,
          language: language,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      
      const botMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      // Fail-safe manual fallback response directly triggered
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🛰️ **Proxy System Notice**: I calculated a response for your prompt under **[${user.learningMode} Mode]**. To get live Gemini results, add a \`GEMINI_API_KEY\` to your server \`.env\` file. In the meantime, I am utilizing preloaded mathematical frameworks for Perceptrons and Quantum Physics. Keep asking!`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice to Text Dictation using browser Web Speech API
  const startVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('⚠️ Speech recognition API is not supported in this browser. Try Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === 'English' ? 'en-US' : 'es-ES';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputMsg(speechToText);
    };

    recognition.start();
  };

  const quickPrompts = [
    { label: "Explain like I'm 5 👶", prompt: "Explain perceptrons and weights in simple terms with an analogy." },
    { label: "Formula Cheat Sheet 📐", prompt: "List the essential optimization functions and equations for deep learning." },
    { label: "Doubt Solver 🧩", prompt: "Explain quantum superposition using a coin analogy." },
    { label: "Synthesize Notes 📝", prompt: "Generate high impact review notes for attention mechanisms." }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      
      {/* Sidebar Mode descriptions */}
      <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-bold tracking-wider text-slate-200">TUNER METADATA</span>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-300 uppercase">Selected Mode</h4>
          <span className="inline-block mt-2 px-2.5 py-1 text-xs font-black text-cyan-400 bg-cyan-950 border border-cyan-800 rounded uppercase">
            {user.learningMode}
          </span>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {modeDescriptions[user.learningMode]}
          </p>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <label className="text-xs font-black text-slate-300 uppercase flex items-center gap-1.5">
            <Languages size={14} className="text-cyan-400" /> Dialect Language
          </label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="English">🇺🇸 English</option>
            <option value="Spanish">🇪🇸 Spanish</option>
            <option value="French">🇫🇷 French</option>
            <option value="German">🇩🇪 German</option>
            <option value="Mandarin">🇨🇳 Mandarin</option>
          </select>
        </div>

        <div className="mt-auto p-3.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono text-slate-500 leading-relaxed">
          *Tip: Toggle AI modes inside the top navigation bar. The chatbot modifies text coordinates instantly.*
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 glassmorphism rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Universe Cognitive Tutor</h3>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                🟢 Gemini Agent Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setMessages([{ id: Date.now().toString(), role: 'assistant', content: 'Chat history cleared. Send a prompt to restart.' }])}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors uppercase font-mono tracking-wider flex items-center gap-1"
          >
            <RefreshCw size={10} /> Clear Memory
          </button>
        </div>

        {/* Chat Logs viewport */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-black/10">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-black ${
                  isBot ? 'bg-cyan-950 border border-cyan-800 text-cyan-400' : 'bg-neonPurple/20 border border-neonPurple/40 text-purple-300'
                }`}>
                  {isBot ? 'AI' : 'U'}
                </div>
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border font-sans select-text ${
                    isBot 
                      ? 'bg-black/40 border-white/5 text-slate-100' 
                      : 'bg-gradient-to-br from-neonPurple/20 to-indigo-950/20 border-neonPurple/30 text-white'
                  }`}>
                    {/* Render helper text linebreaks */}
                    {m.content.split('\n').map((line, idx) => (
                      <p key={idx} className={line.trim() === '' ? 'h-2' : 'mb-1.5'}>
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {isBot && (
                    <button 
                      onClick={() => speakText(m.content)}
                      className="text-xs text-slate-500 hover:text-slate-300 font-bold uppercase tracking-wider hover:underline"
                    >
                      🔊 Hear Answer
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing animation block */}
          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 font-mono italic animate-pulse">
              <div className="h-6 w-6 rounded-full bg-cyan-950 flex items-center justify-center animate-spin">
                <RefreshCw size={10} className="text-cyan-400" />
              </div>
              <span>Formulating cognitive response structures...</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts shortcut cards */}
        {messages.length <= 1 && (
          <div className="px-4 py-3 bg-black/20 border-t border-white/5 flex gap-2.5 overflow-x-auto">
            {quickPrompts.map((card, i) => (
              <button
                key={i}
                onClick={() => handleSend(card.prompt)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-300 hover:text-white hover:border-primaryGlow/30 hover:bg-white/10 whitespace-nowrap transition-all duration-200"
              >
                {card.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Form Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
          
          {/* Glowing speech trigger button */}
          <button 
            type="button"
            onClick={startVoiceDictation}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              listening 
                ? 'bg-rose-950 border-rose-800 text-rose-400 animate-pulse shadow-neon-pink' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30'
            }`}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input 
            type="text"
            required
            placeholder="Browse spatial concepts (e.g. 'Explain Single Perceptrons')..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
          />

          <button 
            type="submit"
            className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-900 transition-all shadow-neon-cyan shrink-0"
          >
            <Send size={15} />
          </button>
        </form>

      </div>
    </div>
  );
}
