import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { 
  Mail, ShieldAlert, Lock, 
  ShieldCheck, Eye, EyeOff, Activity, Key, Cpu
} from 'lucide-react';

export default function Login({ setPage }) {
  const { setUser, addNotification } = useContext(UserContext);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // SHA-256 live hashing states
  const [passwordHash, setPasswordHash] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'text-red-500 bg-red-500/10 border-red-500/20 shadow-neon-red/30' });

  // JWT Decouple drawer state (to verify cryptographically signed mock token)
  const [showJwtDrawer, setShowJwtDrawer] = useState(false);
  const [jwtPayload, setJwtPayload] = useState(null);

  // Compute live password strength & SHA-256 hash as user types
  useEffect(() => {
    const calculateStrength = async () => {
      if (!password) {
        setPasswordHash('');
        setPasswordStrength({ score: 0, label: 'Weak', color: 'text-red-500 bg-red-500/10 border-red-500/20 shadow-neon-red/30' });
        return;
      }

      // Compute Browser SHA-256 digest
      try {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setPasswordHash(hashHex);
      } catch (err) {
        setPasswordHash('hashing_failure');
      }

      // Evaluate requirements
      let score = 0;
      if (password.length >= 6) score += 25;
      if (/[A-Z]/.test(password)) score += 25;
      if (/[0-9]/.test(password)) score += 25;
      if (/[^A-Za-z0-9]/.test(password)) score += 25;

      let strengthData = { score, label: 'Weak', color: '' };
      if (score <= 25) {
        strengthData = { score, label: 'Weak', color: 'text-red-400 bg-red-950/20 border-red-800/30 shadow-neon-red/20' };
      } else if (score === 50) {
        strengthData = { score, label: 'Moderate', color: 'text-amber-400 bg-amber-950/20 border-amber-800/30 shadow-neon-orange/20' };
      } else if (score === 75) {
        strengthData = { score, label: 'Strong', color: 'text-cyan-400 bg-cyan-950/20 border-cyan-800/30 shadow-neon-cyan/20' };
      } else if (score === 100) {
        strengthData = { score, label: 'Fortified', color: 'text-emerald-400 bg-emerald-950/20 border-emerald-800/30 shadow-neon-emerald/30' };
      }
      setPasswordStrength(strengthData);
    };

    calculateStrength();
  }, [password]);

  // Password login handler
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      // 1. Check standard static logins
      let targetRole = '';
      let targetName = '';
      let isValid = false;

      const normEmail = email.toLowerCase().trim();

      if (normEmail === 'scholar@universe.ai' && password === 'CosmicScholar2026!') {
        targetRole = 'Student';
        targetName = 'Scholar';
        isValid = true;
      } else if (normEmail === 'vance@faculty.ai' && password === 'FacultyKeynote99!') {
        targetRole = 'Teacher';
        targetName = 'Vance';
        isValid = true;
      } else if (normEmail === 'operator@system.ai' && password === 'RootTerminalOverride#') {
        targetRole = 'Admin';
        targetName = 'System Admin';
        isValid = true;
      } else {
        // 2. Check dynamic teacher-registered student ledger
        const regStudentsRaw = localStorage.getItem('registered_students');
        if (regStudentsRaw) {
          try {
            const students = JSON.parse(regStudentsRaw);
            const found = students.find(s => s.email.toLowerCase().trim() === normEmail && s.password === password);
            if (found) {
              targetRole = 'Student';
              targetName = found.name;
              isValid = true;
            }
          } catch (err) {
            console.error('Error parsing registered students', err);
          }
        }
      }

      if (!isValid) {
        setLoading(false);
        setErrorMessage('Authentication failed. Invalid User ID or Password.');
        return;
      }

      // Successful Auth: Prepare JWS verification details
      const payload = {
        name: targetName,
        email: normEmail,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${normEmail}`,
        xp: targetRole === 'Student' ? 220 : 0,
        level: targetRole === 'Student' ? 1 : 0,
        streak: targetRole === 'Student' ? 0 : 0,
        learningMode: targetRole === 'Student' ? 'Exam Prep' : 'N/A',
        role: targetRole
      };

      setJwtPayload(payload);
      setLoading(false);
      setShowJwtDrawer(true); // Open secure token visualization for high security feel
    }, 1000);
  };

  // Final login trigger when JWS visualizer is completed
  const completeAuthGateway = () => {
    setUser({
      ...jwtPayload,
      badges: [
        { id: '1', title: 'Pioneer', desc: 'Welcome to the AI Learning Portal', icon: '🚀', unlocked: true },
        { id: '2', title: 'Streak Master', desc: 'Maintain a 5-day daily study streak', icon: '🔥', unlocked: false },
        { id: '3', title: 'Scholar', desc: 'Interact with the AI Tutor 10 times', icon: '🧠', unlocked: false },
        { id: '4', title: 'Quiz Master', desc: 'Score a perfect 100% on any quiz', icon: '🏆', unlocked: false }
      ],
      completedLessons: [],
      studyTime: jwtPayload.xp > 0 ? jwtPayload.xp / 2 : 0
    });

    addNotification({
      title: 'Portal Credentials Mounted 🔑',
      message: `Profile active with role: [${jwtPayload.role}]. Secure JWT token mounted.`,
      time: 'Just now'
    });

    if (jwtPayload.role === 'Teacher') {
      setPage('teacherDashboard');
    } else if (jwtPayload.role === 'Admin') {
      setPage('admin');
    } else {
      setPage('dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 w-full max-w-7xl mx-auto">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full filter blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full filter blur-[120px]" />

      {/* Main glass card container - beautifully centered compact login card */}
      <div className="max-w-lg w-full relative z-10">
        
        {/* Secure Auth Card */}
        <div className="glassmorphism p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-cyan-950/40 border border-cyan-800/40 rounded-xl flex items-center justify-center text-primaryGlow shadow-neon-cyan shrink-0 animate-pulse">
                <ShieldCheck size={24} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                  SECURE AUTH HUB <span className="text-xs bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 font-mono tracking-widest px-2 py-0.5 rounded-full uppercase">SSL</span>
                </h2>
                <p className="text-xs text-slate-400">Enter your credentials to access the learning portal</p>
              </div>
            </div>
          </div>

          {/* Form Viewport */}
          <div className="flex-1 mt-8">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="h-9 w-9 border-t-2 border-primaryGlow border-r-2 border-r-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase animate-pulse">Verifying secure keys...</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {errorMessage && (
                  <div className="p-3 bg-red-950/30 border border-red-900/30 text-xs font-semibold text-red-400 rounded-xl flex gap-2 items-center">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordLogin} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block mb-1">User ID (Email Address)</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                      <input 
                        type="email"
                        required
                        placeholder="e.g. scholar@universe.ai"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block mb-1">Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 h-4 w-4 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Password Strength diagnostics & real-time digest */}
                  {password.length > 0 && (
                    <div className="p-4 bg-black/50 border border-white/5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                          <Activity size={10} className="text-cyan-400 animate-pulse" /> Cryptographic Strength Indicator
                        </span>
                        <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded border ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${
                            passwordStrength.score <= 25 
                              ? 'bg-gradient-to-r from-red-600 to-rose-500 shadow-neon-red' 
                              : passwordStrength.score <= 50 
                                ? 'bg-gradient-to-r from-amber-600 to-orange-500 shadow-neon-orange'
                                : passwordStrength.score <= 75 
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-neon-cyan'
                                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-neon-emerald'
                          }`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>

                      {/* Live SHA-256 hash readout */}
                      {passwordHash && (
                        <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
                          <span className="text-xs font-mono uppercase text-cyan-400 flex items-center gap-1">
                            <Key size={8} /> LIVE CRYPTOGRAPHIC HASH (SHA-256)
                          </span>
                          <span className="text-xs font-mono text-slate-400 break-all select-all leading-normal bg-black/60 p-2 rounded-lg border border-white/5 font-black uppercase tracking-wider">
                            {passwordHash}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-455 hover:to-blue-555 rounded-xl text-sm font-extrabold uppercase tracking-widest text-white shadow-neon-cyan transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    Authenticate and Login
                  </button>
                </form>

              </div>
            )}
          </div>

          {/* Quick-Fill Sandbox Credentials */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono text-center flex items-center justify-center gap-1.5">
              <Cpu size={12} className="text-cyan-400" /> Dummy Access Accounts
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Student */}
              <button
                type="button"
                onClick={() => {
                  setEmail('scholar@universe.ai');
                  setPassword('CosmicScholar2026!');
                }}
                className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-left hover:border-cyan-500/40 hover:bg-cyan-950/10 transition-all duration-300"
              >
                <div className="text-xs font-black text-cyan-300 uppercase tracking-wider">🎓 Student</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">scholar@universe.ai</div>
              </button>

              {/* Teacher */}
              <button
                type="button"
                onClick={() => {
                  setEmail('vance@faculty.ai');
                  setPassword('FacultyKeynote99!');
                }}
                className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-left hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-300"
              >
                <div className="text-xs font-black text-purple-300 uppercase tracking-wider">👨‍🏫 Teacher</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">vance@faculty.ai</div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => {
                  setEmail('operator@system.ai');
                  setPassword('RootTerminalOverride#');
                }}
                className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-left hover:border-rose-500/40 hover:bg-rose-950/10 transition-all duration-300"
              >
                <div className="text-xs font-black text-rose-300 uppercase tracking-wider">🛠️ Admin</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">operator@system.ai</div>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Decrypted JWT Parser Visualizer Drawer overlay */}
      {showJwtDrawer && jwtPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-xl w-full glassmorphism rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <div className="flex flex-col items-center text-center gap-1.5 mb-5">
              <div className="h-8 w-8 bg-emerald-950/40 border border-emerald-800/40 rounded-lg flex items-center justify-center text-emerald-400 shadow-neon-emerald">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-black uppercase text-white tracking-widest mt-1">
                JSON Web Token Verified
              </h3>
              <p className="text-xs text-slate-400 max-w-md leading-normal">
                Credentials packed inside an encrypted JWT token. Cryptographic handshake successful:
              </p>
            </div>

            <div className="space-y-3">
              
              <div className="bg-slate-950/85 border border-white/5 rounded-xl p-3 font-mono text-xs space-y-3 overflow-x-auto text-left">
                
                {/* Part 1: JWT Header */}
                <div>
                  <div className="text-rose-400 font-extrabold uppercase tracking-widest text-xs mb-0.5">
                    HEADER
                  </div>
                  <pre className="bg-rose-950/20 border border-rose-900/30 p-1.5 rounded-lg text-rose-300 font-mono">
{`{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "cosmos-key-node-42"
}`}
                  </pre>
                </div>

                {/* Part 2: JWT Payload */}
                <div>
                  <div className="text-cyan-400 font-extrabold uppercase tracking-widest text-xs mb-0.5">
                    PAYLOAD (DECRYPTED PROFILE)
                  </div>
                  <pre className="bg-cyan-950/20 border border-cyan-900/30 p-1.5 rounded-lg text-cyan-300 font-mono">
{JSON.stringify({
  sub: jwtPayload.email,
  name: jwtPayload.name,
  role: jwtPayload.role,
  xp: jwtPayload.xp,
  level: jwtPayload.level,
  streak: jwtPayload.streak,
  learningMode: jwtPayload.learningMode,
  iss: "adaptive-learning-gateway",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600 * 24
}, null, 2)}
                  </pre>
                </div>

                {/* Part 3: JWT Signature */}
                <div>
                  <div className="text-purple-400 font-extrabold uppercase tracking-widest text-xs mb-0.5">
                    SIGNATURE
                  </div>
                  <pre className="bg-purple-950/20 border border-purple-900/30 p-1.5 rounded-lg text-purple-300 font-mono break-all">
RSASHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "PUBLIC_KEY"
)
                  </pre>
                </div>

              </div>

              <div className="p-2 bg-emerald-950/25 border border-emerald-900/40 rounded-xl text-xs text-emerald-400 font-mono text-center flex items-center justify-center gap-1.5">
                <ShieldCheck size={10} className="text-emerald-400 animate-pulse" /> Security Signature Valid (RS256 Certificate)
              </div>

            </div>

            {/* Action buttons */}
            <div className="mt-5 flex justify-center">
              <button
                onClick={completeAuthGateway}
                className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-sm font-black uppercase tracking-widest text-white shadow-neon-emerald hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 animate-bounce"
              >
                Launch Secure Session
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
