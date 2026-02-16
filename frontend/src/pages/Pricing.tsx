import React, { useEffect, useRef } from 'react';
import { Check, Zap, ArrowRight, MousePointer2 } from 'lucide-react';

export const Pricing = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    const children = sectionRef.current.querySelectorAll('.reveal-item');
    children.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-20 bg-[#030509] relative overflow-hidden border-y border-white/5">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal-item opacity-0 translate-y-10 transition-all duration-1000">
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 backdrop-blur-md">
                <img src="openclaw.png" className="w-5 h-5 object-contain" alt="OpenCalw" />
              </div>
              <span className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
                Premium Infrastructure
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Compute.</span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-500 text-[11px] font-medium uppercase tracking-widest border-l border-white/10 pl-6 h-fit mb-2">
             <MousePointer2 size={14} className="text-blue-500" />
             One-click Deployment
          </div>
        </div>

        {/* PRICING CARDS: FORCED SIDE-BY-SIDE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 max-w-4xl mx-auto reveal-item opacity-0 translate-y-10 transition-all duration-1000 delay-200">
          
          {/* STARTER CARD */}
          <div className="group relative bg-[#0B0D17]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col transition-all duration-500 hover:border-white/20 hover:bg-[#0B0D17]/80 h-full">
            <div className="flex justify-between items-start mb-8 text-left">
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Basic Protocol</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">$6</span>
                  <span className="text-slate-600 text-sm">/mo</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                <img src="openclaw.png" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all" alt="Calw" />
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-grow text-left">
              {[
                { l: "2 Shared vCPU", d: "Standard Performance" },
                { l: "4GB DDR4 RAM", d: "Managed Allocation" },
                { l: "50GB Gen4 Storage", d: "High-speed NVMe" },
                { l: "Global Network", d: "Standard Routing" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 lg:gap-4 group/line">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover/line:border-blue-500/40 transition-colors">
                    <Check size={10} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-200 text-[13px] lg:text-sm font-semibold">{item.l}</span>
                    <span className="text-slate-600 text-[9px] lg:text-[10px] uppercase tracking-tighter leading-none mt-0.5">{item.d}</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="/create" className="block w-full mt-auto">
              <button className="relative overflow-hidden w-full py-4 rounded-xl border border-white/10 text-white text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <span className="relative z-10 text-center block w-full">Initialize Starter</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </a>
          </div>

          {/* APEX CARD (PRO) */}
          <div className="group relative h-full">
            <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-700" />
            
            <div className="relative h-full bg-[#05070A] border border-blue-500/30 rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-2xl transition-all duration-500 hover:translate-y-[-8px]">
              <div className="flex justify-between items-start mb-8 text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-[9px] font-black uppercase tracking-widest mb-4">
                    <Zap size={10} className="fill-blue-400" /> Apex Managed
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">$15</span>
                    <span className="text-blue-500/40 text-sm">/mo</span>
                  </div>
                </div>
                <div className="relative shrink-0">
                   <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                   <img src="openclaw.png" className="w-12 h-12 lg:w-14 lg:h-14 object-contain animate-bounce-slow relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" alt="OpenCalw Pro" />
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow text-left">
                {[
                  "Unlimited Priority Compute", 
                  "Unlimited RAM Resources", 
                  "150GB Gen4 Direct-Storage", 
                  "Zero Rate-Limit Access"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 lg:gap-4 group/line">
                    <div className="h-px w-4 bg-blue-500/50 shrink-0" />
                    <span className="text-white text-[13px] lg:text-sm font-medium tracking-wide">{item}</span>
                  </div>
                ))}
              </div>

              <a href="/create" className="block w-full mt-auto">
                <button className="relative overflow-hidden w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2 lg:gap-3 group-hover:gap-5">
                  <span className="relative z-10">Boost Workload</span>
                  <ArrowRight size={16} className="relative z-10 shrink-0" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </section>
  );
};