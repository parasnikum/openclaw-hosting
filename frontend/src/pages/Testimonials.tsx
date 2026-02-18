import React from 'react';
import { Star, Shield, Zap, Cpu, Globe, Terminal, Command, CheckCircle2 } from 'lucide-react';

const TestimonialsSection = () => {
  const reviews = [
    { 
      name: "Massimo Ahmed", 
      role: "DevOps Lead", 
      image: "user/waqar.png",
      text: "Decimated our deployment overhead. 8 production nodes in minutes—pure architecture.", 
      tag: "Enterprise" 
    },
    { 
      name: "Isla Villa", 
      role: "AI Architect", 
      image: "user/isla.png",
      text: "The most resilient panel in the stack. Handles high-load neural deployments with zero jitter.", 
      tag: "Stability" 
    },
    { 
      name: "Massimo Lewis", 
      role: "Fullstack Dev", 
      image: "user/massimo.png",
      text: "Finally, a panel that respects the developer.", 
      tag: "Performance" 
    },
    { 
      name: "Brian Geovanny", 
      role: "Systems Lead", 
      image: "user/brian.png",
      text: "Latency reduction was immediate. Faster than other providers..", 
      tag: "Speed" 
    },
    { 
      name: "Rahul Singh", 
      role: "Node Operator", 
      image: "user/rahul.png",
      text: "The best tech for independent hosting.", 
      tag: "Verified" 
    }
  ];

  const trustCards = [
    { icon: <Shield size={14} />, label: "Hardened Kernel" },
    { icon: <Zap size={14} />, label: "Sub-10ms Latency" },
    { icon: <Cpu size={14} />, label: "EPYC™ Optimized" },
    { icon: <Globe size={14} />, label: "Edge Native" }
  ];

  const slidingItems = [...reviews, ...reviews];

  return (
    <section className="py-20 bg-[#0B0D17] border-t border-white/5 overflow-hidden font-sans">
      
      {/* CENTERED COMPACT HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <h2 className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-3">Network Proof</h2>
        <p className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mb-8">
          Built for <span className="text-slate-600">The 1%.</span>
        </p>
        
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#3b82f6" className="text-blue-500" />)}
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Rated</span>
        </div>
      </div>

      {/* SLIDER WITH GRADIENT FADE EDGES */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0D17] via-[#0B0D17]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0D17] via-[#0B0D17]/80 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden select-none">
          <div className="flex animate-compact-scroll gap-4 py-4 px-2 group-hover:[animation-play-state:paused]">
            {slidingItems.map((item, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 transition-all duration-500 hover:scale-[1.02] ${
                  item.text 
                    ? "w-[300px] bg-[#121624] border border-white/[0.05] p-5 rounded-2xl flex flex-col justify-between shadow-2xl" 
                    : "w-[180px] bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2"
                }`}
              >
                {item.text ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                      </div>
                      <span className="text-[8px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest">{item.tag}</span>
                    </div>
                    
                    <p className="text-slate-300 text-[12px] font-medium leading-relaxed italic mb-6">"{item.text}"</p>
                    
                    <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10  transition-all"
                      />
                      <div className="text-left">
                        <div className="text-[10px] font-black text-white uppercase italic tracking-tight">{item.name}</div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{item.role}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 py-6">
                    {item.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes compact-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-compact-scroll {
          display: flex;
          width: max-content;
          animation: compact-scroll 50s linear infinite;
        }
      `}} />
    </section>
  );
};

export default TestimonialsSection;