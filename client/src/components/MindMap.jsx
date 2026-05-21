import React, { useState, useEffect } from 'react';
import { Network, Sparkles, BookOpen } from 'lucide-react';

export default function MindMap({ topic = 'Deep Learning Foundations' }) {
  const [loading, setLoading] = useState(false);
  const [mindmap, setMindmap] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  const fetchMindMap = async () => {
    setLoading(true);
    setActiveNode(null);
    try {
      const res = await fetch('/api/ai/generate-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setMindmap(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMindMap();
  }, [topic]);

  return (
    <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primaryGlow animate-pulse" />
          <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">AI Conceptual Mind Map</span>
        </div>
        <button 
          onClick={fetchMindMap}
          className="text-xs text-primaryGlow border border-primaryGlow/30 px-2.5 py-1 rounded-lg hover:bg-primaryGlow/10 transition-colors duration-200 flex items-center gap-1.5"
          disabled={loading}
        >
          <Sparkles size={12} /> {loading ? 'Regenerating...' : 'Re-Generate'}
        </button>
      </div>

      {loading ? (
        <div className="h-80 w-full flex flex-col items-center justify-center gap-2 animate-pulse">
          <div className="h-10 w-10 border-t-2 border-r-2 border-primaryGlow rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyan-400">Generating study map...</span>
        </div>
      ) : mindmap ? (
        <div className="relative">
          {/* Node SVG mapping canvas */}
          <div className="w-full h-80 rounded-xl bg-slate-950/60 border border-white/5 relative overflow-hidden flex items-center justify-center">
            
            {/* SVG Connecting Vectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {mindmap.nodes.map((node) => {
                const parent = mindmap.root;
                if (!parent) return null;
                return (
                  <g key={`line-${node.id}`}>
                    <line 
                      x1={parent.x} 
                      y1={parent.y} 
                      x2={node.x} 
                      y2={node.y} 
                      stroke={node.color} 
                      strokeWidth="1.5" 
                      strokeDasharray="4,4"
                      className="animate-pulse"
                      strokeOpacity="0.4"
                    />
                    {/* Secondary leaf connections */}
                    {node.id === 'n4' && (
                      <line 
                        x1={100} y1={280} x2={node.x} y2={node.y} 
                        stroke="#39ff14" strokeWidth="1" strokeOpacity="0.3"
                      />
                    )}
                    {node.id === 'n5' && (
                      <line 
                        x1={250} y1={280} x2={node.x} y2={node.y} 
                        stroke="#39ff14" strokeWidth="1" strokeOpacity="0.3"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central Root Node */}
            <button 
              onClick={() => setActiveNode({ title: mindmap.root.label, desc: 'Central theme of your current study plan. Click connecting nodes to browse detailed analytical breakdowns.' })}
              className="absolute z-10 p-3 rounded-2xl bg-indigo-950/80 border-2 border-primaryGlow text-white text-xs font-black uppercase tracking-wider shadow-neon-cyan hover:scale-105 transition-all duration-200"
              style={{ left: `${mindmap.root.x - 70}px`, top: `${mindmap.root.y - 20}px` }}
            >
              🧠 {mindmap.root.label}
            </button>

            {/* Branches Leaf Nodes */}
            {mindmap.nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setActiveNode({ 
                  title: node.label, 
                  desc: `Expert guidelines for [${node.label}]. Master this node to earn an extra 100 XP. Studies indicate structured visual layouts improve spatial logic retention by up to 40%.` 
                })}
                className="absolute z-10 px-3 py-1.5 rounded-xl bg-slate-900 border text-xs font-bold text-slate-300 transition-all duration-300 hover:scale-110 shadow-lg"
                style={{ 
                  left: `${node.x - 60}px`, 
                  top: `${node.y - 15}px`,
                  borderColor: node.color,
                  boxShadow: `0 0 10px ${node.color}30`
                }}
              >
                📖 {node.label}
              </button>
            ))}

            {/* Scale indicator */}
            <div className="absolute bottom-2 right-3 text-xs font-mono text-slate-500">
              Interactive SVG Mapping Engine v1.0
            </div>
          </div>

          {/* Node Summary Inspector */}
          {activeNode && (
            <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-3">
              <BookOpen className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wide">{activeNode.title}</h4>
                <p className="text-xs mt-1 leading-relaxed text-slate-300">{activeNode.desc}</p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
