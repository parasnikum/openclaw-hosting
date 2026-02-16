import React, { useEffect, useRef } from 'react';
import { Cpu, Workflow, Lock } from 'lucide-react';

export const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = containerRef.current.querySelectorAll('.reveal-feature');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cards = [
    { 
      title: "Isolated Runtimes", 
      icon: <Cpu />, 
      sub: "Deployment: 100%", 
      val: "w-full", 
      desc: "Kernel-level isolation for every bot. Your AI agents run in hardened micro-VMs, preventing cross-process interference." 
    },
    { 
      title: "Instant Provision", 
      icon: <Workflow />, 
      sub: "Get easy deployed", 
      val: "w-[80%]", 
      desc: "Deploy OpenClaw instances in under 60 seconds. Pre-configured environments with all dependencies baked into the core kernel." 
    },
    { 
      title: "Atomic Security", 
      icon: <Lock />, 
      sub: "AES: 256-BIT", 
      val: "w-[95%]", 
      desc: "End-to-end AES-256 encryption for all node traffic. Secure your data pipelines from the edge to the core." 
    }
  ];

  return (
    <section id="features" ref={containerRef} className="py-24 relative overflow-hidden bg-[#0B0D17]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-20 gap-8 reveal-feature opacity-0 translate-y-12 transition-all duration-1000">
          <div className="text-center lg:text-left">
            <h2 className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-4">
              Core Infrastructure
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Built for <br />
              <span className="text-slate-500">Speed.</span>
            </h3>
          </div>
          
          <div className="hidden lg:block text-right">
            <div className="flex gap-1.5 mb-3 justify-end">
              {[1, 2, 3].map(i => <div key={i} className="w-6 h-1 bg-blue-600 rounded-full" />)}
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
              System Protocol v4.0
            </p>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className="reveal-feature opacity-0 translate-y-12 group relative transition-all duration-1000"
              style={{ transitionDelay: `${i * 200}ms` }} // Staggered entrance
            >
              {/* Card Background Glow */}
              <div className="absolute -inset-px bg-gradient-to-b from-blue-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full bg-[#111420] border border-white/5 p-8 rounded-3xl flex flex-col transition-all duration-500 group-hover:bg-[#151926] group-hover:-translate-y-2 group-hover:border-white/10 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                
                {/* ICON BOX */}
                <div className="w-14 h-14 bg-[#1C212E] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-500">
                  {React.cloneElement(card.icon, { 
                    className: "text-blue-400 group-hover:text-blue-300 transition-colors", 
                    size: 24 
                  })}
                </div>

                {/* CONTENT */}
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {card.title}
                </h4>
                
                <p className="text-[15px] text-slate-400 leading-relaxed mb-8 flex-grow font-normal">
                  {card.desc}
                </p>

                {/* FOOTER / STATS */}
                <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      {card.sub}
                    </span>
                    <span className="text-[11px] text-blue-500 font-bold italic">Stable</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${card.val} bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-[1.5s] ease-out delay-500 group-hover:from-blue-400 group-hover:to-cyan-400`} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};