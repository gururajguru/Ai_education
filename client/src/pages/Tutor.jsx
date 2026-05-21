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

  const generateLocalResponse = (prompt, mode, lang) => {
    const query = prompt.toLowerCase();
    
    // Choose pedagogical tone intro based on learningMode
    let intro = "";
    if (mode === 'Beginner') {
      intro = `### 🧠 AI Cognitive Tutor [Beginner Metaphor Mode]\n*Let's break this down using simple concepts and relatable analogies!*\n\n`;
    } else if (mode === 'Fast Learner') {
      intro = `### ⚡ AI Cognitive Tutor [Fast Summary Mode]\n*Core equations, direct logic flow, and condensed facts below:*\n\n`;
    } else if (mode === 'Exam Prep') {
      intro = `### 📐 AI Cognitive Tutor [Exam Revision Mode]\n*Here is a high-yield cheat sheet with key definitions and common pitfalls to watch out for:*\n\n`;
    } else if (mode === 'Visual Learning') {
      intro = `### 🎨 AI Cognitive Tutor [Visual Diagram Mode]\n*Here is a structured conceptual diagram representing this topic:*\n\n`;
    } else {
      intro = `### 🧠 AI Cognitive Tutor [Active Recall Mode]\n\n`;
    }

    // Perceptrons & Weight adjustments
    if (query.includes('perceptron') || query.includes('weight') || query.includes('bias') || query.includes('neural')) {
      if (mode === 'Beginner') {
        return intro + `**What is a Perceptron?**
Imagine a Perceptron as a **decision-making filter** in a baking recipe.
- **Inputs ($X_i$)**: The ingredients (e.g., flour, sugar, salt).
- **Weights ($W_i$)**: How important each ingredient is. Flour is crucial (high weight), whereas salt is less important (low weight).
- **Bias ($b$)**: Your baseline sweet tooth. If you love sweet things, your bias is high, making it easier to declare the recipe "Approved!"
- **Activation Function**: The final taste test. If the sum of (ingredients $\times$ importance) + sweet tooth is above a certain threshold, the recipe is a hit!

**The Mathematical Formula:**
$$Output = f\\left(\\sum (X_i \\cdot W_i) + b\\right)$$`;
      } else if (mode === 'Visual Learning') {
        return intro + `**Concept Diagram: Artificial Neuron (Perceptron)**
\`\`\`
  Inputs (X)      Weights (W)     Summation (Σ)     Activation (f)
  [ flour ]   ───>  [ 0.8 ]  ───┐
                                 │
  [ sugar ]   ───>  [ 0.6 ]  ───┼─> [ Σ(X·W) + b ] ───> [ Step Function ] ───> Decision (0 or 1)
                                 │
  [  salt  ]   ───>  [ 0.1 ]  ───┘
                                 ▲
  [  Bias  ]   ──────────────────┘
\`\`\`
- **Summation**: Aggregates inputs scaled by weights.
- **Activation (Step)**: Fires a binary decision 1 (Approved) or 0 (Rejected).`;
      } else {
        return intro + `**Artificial Neuron (Perceptron) Core Checklist:**
- **Mathematical Definition**: The fundamental building block of artificial neural networks, computing a weighted sum of inputs and applying a step function:
  $$y = \\sigma\\left(\\sum_{i=1}^n w_i x_i + b\\right)$$
- **Weights ($W$)**: Parameters representing link strengths. During training, backpropagation calculates loss gradients to adjust these weights.
- **Bias ($b$)**: An offset parameter adjusting the decision boundary's position, allowing the network to shift the activation function curve.
- **Common Pitfall**: A single perceptron can only solve **linearly separable** classification boundaries (it cannot solve the XOR logic problem without hidden layers!).`;
      }
    }

    // Superposition & Quantum Computing
    if (query.includes('superposition') || query.includes('qubit') || query.includes('quantum') || query.includes('hadamard') || query.includes('shor')) {
      if (mode === 'Beginner') {
        return intro + `**Understanding Qubit Superposition:**
Imagine a regular computer bit as a **coin lying flat on a table**. It is either **Heads (1)** or **Tails (0)**.
A Qubit in **Superposition** is like that **coin spinning rapidly on the table**. While spinning, is it Heads or Tails? It is a probability mixture of both at the same time! 
Only when you slap your hand down to stop it (which is a **Measurement** in quantum physics) does it collapse into a definite Heads (1) or Tails (0) state.

**Hadamard Gate ($H$)**:
This is the "flick" that starts the coin spinning. It takes a stable state $|0\\rangle$ and kicks it into a 50/50 superposition state:
$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$$`;
      } else if (mode === 'Visual Learning') {
        return intro + `**Quantum Bloch Sphere Vector:**
\`\`\`
             |0⟩ (North Pole)
                 ▲
                 │   
                 │  / 
                 │ /  |ψ⟩ = α|0⟩ + β|1⟩ (Superposition State Vector)
                 │/_____\ 
        ─────────┼─────────> Y
                /│
               / │
              ▼  │
             X   ▼
             |1⟩ (South Pole)
\`\`\`
- The North Pole represents a pure $|0\\rangle$ state.
- The South Pole represents a pure $|1\\rangle$ state.
- Any point along the equator represents a state of **100% Superposition** with varying phase vectors.`;
      } else {
        return intro + `**Qubit Superposition & Quantum Mechanics Cheat Sheet:**
- **State Vector Representation**: 
  $$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$
  where $\\alpha$ and $\\beta$ are complex probability amplitudes satisfying:
  $$|\\alpha|^2 + |\\beta|^2 = 1$$
- **Hadamard Transform ($H$)**: Creates a superposition state by mapping basis vectors:
  $$H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$
- **Collapse upon Measurement**: Once measured, the state vector collapse forces it into $|0\\rangle$ (with probability $|\\alpha|^2$) or $|1\\rangle$ (with probability $|\\beta|^2$).`;
      }
    }

    // Attention Mechanism & Transformers
    if (query.includes('attention') || query.includes('transformer') || query.includes('self-attention') || query.includes('formula')) {
      if (mode === 'Beginner') {
        return intro + `**What is Self-Attention?**
Imagine you are reading a detective novel and you come across the sentence:
> *"The detective grabbed the keys and unlocked **it**."*

How do you know what **"it"** refers to?
Your brain automatically connects **"it"** to **"keys"** (or the **"lock"**). That is **Attention**!
In LLMs, **Self-Attention** is a mathematical formula that calculates how much weight or focus each word should give to every other word in a sentence to understand its contextual meaning.`;
      } else if (mode === 'Visual Learning') {
        return intro + `**Self-Attention Mapping Diagram:**
\`\`\`
 Input Sequence: "The detective unlocked the door with it"
                                              │
                      Query vector (Q) ───┐   ▼
                                          ├───> Attention Scores (Softmax)
                      Key vector (K)   ───┘   │
                                              ▼
                      Value vector (V) ───────> Weighted Context Representation
\`\`\``;
      } else {
        return intro + `**Transformer Self-Attention Core Equations:**
- **Queries ($Q$), Keys ($K$), and Values ($V$)**: Scaled dot-product attention utilizes projection matrices to extract query, key, and value vectors:
  $$Attention(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$
- **Scaling Factor ($d_k$)**: Dividing by the square root of the key dimension $\\sqrt{d_k}$ stabilizes gradients during training, preventing the softmax function from saturating.
- **Multi-Head Attention**: Allows the network to jointly attend to information from different representation subspaces at different positions.`;
      }
    }

    // WebRTC & Networking
    if (query.includes('webrtc') || query.includes('peer') || query.includes('network') || query.includes('handshake')) {
      return intro + `**Web Real-Time Communication (WebRTC) Framework:**
- **Peer-to-Peer (P2P)**: WebRTC connects browsers directly for low-latency audio, video, and data streaming.
- **Signaling**: Before a direct link is established, browsers exchange metadata (SDP session descriptions, ICE candidates) via an external broker (e.g. Socket.io server).
- **ICE & STUN/TURN**: 
  - **STUN** servers discover a browser's public IP and port coordinates.
  - **TURN** servers relay traffic if firewalls block direct connection handshakes.
- **Vitals**: Uses SRTP (Secure Real-time Transport Protocol) for cryptographic media encryption.`;
    }

    // Optimization & Gradient Descent
    if (query.includes('gradient') || query.includes('descent') || query.includes('optimizer') || query.includes('adam')) {
      return intro + `**Gradient Descent & Parameter Optimization:**
- **Gradient Descent**: The fundamental optimizer modifying model parameters to minimize a loss function $J(\\theta)$:
  $$\\theta = \\theta - \\eta \\nabla_\\theta J(\\theta)$$
  where $\\eta$ is the learning rate.
- **Stochastic Gradient Descent (SGD)**: Calculates gradients using a single random training sample (or mini-batch) to reduce compute times.
- **Adam Optimizer**: Combines Momentum (smoothing step velocity) and RMSprop (adapting learning rates based on squared gradients) to stabilize backpropagation curves.`;
    }

    // Default fallback response
    return intro + `**Concept Calibrated Summary: "${prompt}"**
I have analyzed your query and structured an explanation under **[${mode} Mode]**:

1. **Key Foundation**: This concept connects mathematical models (weights, parameters) with cognitive learning routes.
2. **Context Tuning**: When studying under ${mode} mode, we focus on ${mode === 'Beginner' ? 'simple analogical metaphors' : 'high-yield facts and equations'} to secure attention scores.
3. **Practice Verification**: Test these concepts in the **Smart Courses** or the **Active Recall Flashcards** sections in your sidebar to earn more XP points!

*Tip: Add a \`GEMINI_API_KEY\` to your hosted backend env config to activate live dynamic conversational replies.*`;
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
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          mode: user.learningMode,
          language: language,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      // Netlify static redirects route 404s to HTML pages, check clean JSON header
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error('API server is offline or returned static index HTML.');
      }

      const data = await response.json();
      
      const botMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.warn('API connection offline or hosted statically. Launching cognitive fallback engine.', err);
      
      // Delay response slightly for natural chat feel
      setTimeout(() => {
        const fallbackText = generateLocalResponse(textToSend, user.learningMode, language);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackText
        }]);
        setLoading(false);
      }, 800);
      
      // Exit early since we handle state dynamically inside timeout
      return;
    }
    
    setLoading(false);
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
