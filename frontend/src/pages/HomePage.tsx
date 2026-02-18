import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Terminal,
  Server,
  Globe,
  ChevronDown,
  Activity,
  Cpu,
  Lock,
  Workflow,
  ExternalLink,
  BookOpen,
  Shield,
  Box,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import TestimonialsSection from './Testimonials';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Features } from './Features';
import { Pricing } from './Pricing';

const OpenClawPaaS = () => {
  // --- SCROLL ANIMATION ENGINE ---
  useEffect(() => {
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    targets.forEach(el => observer.observe(el));

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
      sub: "Speed: <12ms",
      val: "w-[80%]",
      desc: "Deploy OpenClaw instances in under 12 seconds. Pre-configured environments with all dependencies baked into the core kernel."
    },
    {
      title: "Atomic Security",
      icon: <Lock />,
      sub: "AES: 256-BIT",
      val: "w-[95%]",
      desc: "End-to-end AES-256 encryption for all node traffic. Secure your data pipelines from the edge to the core."
    }
  ];


  const stats = [
    { label: "Uptime", value: "99.99%" },
    { label: "Global Nodes", value: "30+" },
    { label: "Avg Latency", value: "<40ms" },
    // { label: "Daily Backups", value: "Encrypted" },
  ];

  return (
    <div className="sticky top-0 z-[100] w-full border-b bg-[#0B0D17]  border-white/5 shadow-2xl">

      {/* --- SYSTEM STATUS BAR (Unchanged) --- */}
      <div className="bg-[#0F172A] border-b border-blue-500/10 py-2 px-6 relative z-[60]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-black text-blue-500/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              Engine Status: Operational
            </span>
            {/* <span className="hidden sm:inline border-l border-white/10 pl-4 text-slate-500 italic">Current Version: v2.4.0-stable</span> */}
          </div>
          <div className="flex gap-6 italic">
            {/* <a href="#" className="hover:text-blue-400 transition flex items-center gap-1">API Docs <ExternalLink size={10} /></a>
            <a href="#" className="hover:text-blue-400 transition">Network Status</a> */}
          </div>
        </div>
      </div>

      <Navbar />

      <header className="relative pt-24 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.85] uppercase italic text-center lg:text-left">
                Build <br />
                <span className="pr-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white uppercase">Application</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed italic uppercase tracking-tighter">
                Deploy dedicated bot nodes with sub-50ms latency and 1-click lifecycle management.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start italic font-black">
                <a href="/dashboard" target="_blank" rel="noopener noreferrer"> <button className="w-full sm:w-auto bg-blue-600 hover:bg-white hover:text-black text-white px-10 py-5 rounded-xl text-lg flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] uppercase">
                  Launch Node <LayoutDashboard size={20} />
                </button></a>
                {/* <button className="w-full sm:w-auto bg-transparent border border-white/10 hover:border-blue-500/40 text-white px-8 py-5 rounded-xl font-bold transition flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em]">
                  <BookOpen size={18} /> View Docs
                </button> */}
              </div>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 grayscale opacity-40">
                {stats.map((s, i) => (
                  <div key={i} className="text-left">
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1 italic">{s.label}</div>
                    <div className="text-lg font-black text-white italic">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative perspective-1000 hidden lg:block">
              <div className="relative group transition-transform duration-1000 ease-out [transform:rotateX(10deg)_rotateY(-20deg)_rotateZ(5deg)] hover:rotate-0">
                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-emerald-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#1C212E] rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                  <div className="bg-[#0B0D17] px-4 py-3 border border-white/5 rounded-t-2xl flex items-center justify-between">
                    <div className="flex gap-1.5 opacity-40">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="text-[9px] font-mono tracking-widest uppercase text-slate-600 italic">OpenClaw Cloud Interface / 0x1</div>
                    <div className="w-10"></div>
                  </div>
                  <div className="p-6 bg-[#151926] border-x border-b border-white/5 rounded-b-2xl">
                    <div className="bg-[#1C212E] p-5 rounded-xl border border-white/5 shadow-inner">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#FF4D4D] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,77,77,0.3)]">
                            <img src="openclaw.png" className="w-7 h-7 brightness-0 invert" alt="bot" />
                          </div>
                          <div>
                            <div className="text-white font-black text-lg tracking-tighter uppercase italic flex items-center gap-2">
                              production-bot-v2
                              <span className="bg-emerald-500/10 text-emerald-500 text-[8px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest not-italic italic font-black">Running</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic flex items-center gap-1.5">
                              <Server size={10} className="text-blue-500" /> openclaw-managed-node
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 font-black italic">
                          <div className="h-8 w-24 bg-[#0B0D17] border border-white/5 rounded-md flex items-center justify-center text-[9px] text-slate-600 uppercase tracking-widest">Actions <ChevronDown size={12} className="ml-1" /></div>
                          <div className="h-8 px-4 bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 rounded-md flex items-center justify-center text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(255,77,77,0.1)]">Dashboard</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-3">
                          <Terminal size={14} className="text-blue-500" />
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[40%] bg-blue-500"></div></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Activity size={14} className="text-blue-500" />
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-[20%] bg-emerald-500"></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      < Pricing />

      <Features />

      <div className="reveal"><TestimonialsSection /></div>

      {/* --- FOOTER --- */}
      < Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .perspective-1000 { perspective: 1500px; }

        /* SCROLL REVEAL ENGINE */
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .reveal-right { opacity: 0; transform: translateX(50px); transition: all 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .is-visible { opacity: 1; transform: translate(0) scale(1); }
        ` }} />

    </div>
  );
};

export default OpenClawPaaS;