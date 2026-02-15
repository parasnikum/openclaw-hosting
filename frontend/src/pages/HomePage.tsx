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

  const stats = [
    { label: "Uptime", value: "99.99%" },
    { label: "Global Nodes", value: "30+" },
    { label: "Avg Latency", value: "<40ms" },
    { label: "Daily Backups", value: "Encrypted" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D17] text-slate-300 font-sans selection:bg-blue-600/30 overflow-x-hidden">

      {/* --- SYSTEM STATUS BAR (Unchanged) --- */}
      <div className="bg-[#0F172A] border-b border-blue-500/10 py-2 px-6 relative z-[60]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-black text-blue-500/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              Engine Status: Operational
            </span>
            <span className="hidden sm:inline border-l border-white/10 pl-4 text-slate-500 italic">Current Version: v2.4.0-stable</span>
          </div>
          <div className="flex gap-6 italic">
            <a href="#" className="hover:text-blue-400 transition flex items-center gap-1">API Docs <ExternalLink size={10} /></a>
            <a href="#" className="hover:text-blue-400 transition">Network Status</a>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION (Unchanged) --- */}
      <nav className="border-b border-white/5 sticky top-0 bg-[#0B0D17]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1C212E] p-1.5 rounded-xl border border-white/10 shadow-lg">
              <img src="https://xcloud.host/wp-content/uploads/2026/02/openclaw-1-1.png" className="w-8 h-8 object-contain" alt="OpenClaw Logo" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">BerryBox.<span className="text-blue-600">Cloud</span></span>
          </div>

          <div className="hidden lg:flex gap-10 text-[12px] font-bold text-slate-400 uppercase tracking-widest italic">
            <a href="#compute" className="hover:text-blue-500 transition">Compute</a>
            <a href="#docs" className="hover:text-blue-500 transition">Documentation</a>
            <a href="#pricing" className="hover:text-blue-500 transition">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/login" className="text-xs font-black text-white hover:text-blue-500 transition px-4 py-2 uppercase tracking-widest italic">Log In</a>
            <a href="/register" className="bg-blue-600 text-white hover:bg-white hover:text-black px-6 py-2.5 rounded-lg text-xs font-black transition-all transform active:scale-95 uppercase tracking-wider shadow-xl shadow-blue-900/20 italic">Sign Up Free</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (DO NOT TOUCH - PLACED AS IS) --- */}
      <header className="relative pt-24 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.85] uppercase italic text-center lg:text-left">
                Hardened <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white uppercase">AI Compute</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed italic uppercase tracking-tighter">
                Isolated VM orchestration for OpenClaw. Deploy dedicated bot nodes with sub-50ms latency and 1-click lifecycle management.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start italic font-black">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-white hover:text-black text-white px-10 py-5 rounded-xl text-lg flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] uppercase">
                  Launch Node <LayoutDashboard size={20} />
                </button>
                <button className="w-full sm:w-auto bg-transparent border border-white/10 hover:border-blue-500/40 text-white px-8 py-5 rounded-xl font-bold transition flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em]">
                  <BookOpen size={18} /> View Docs
                </button>
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
                            <img src="https://xcloud.host/wp-content/uploads/2026/02/openclaw-1-1.png" className="w-7 h-7 brightness-0 invert" alt="bot" />
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

      {/* --- COMPACT APEX ARCHITECTURE: GLASS & GLOSS --- */}
      <section id="pricing" className="py-16 bg-[#030509] relative overflow-hidden border-y border-white/5 font-sans selection:bg-blue-500/30">

        {/* --- MOVING ANIMATED BACKGROUND --- */}
        {/* Animated Bokeh / Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Subtle Star/Particle Grid */}
          <div className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">

          {/* COMPACT HUD HEADER */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 reveal">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                </span>
                <span className="text-blue-400 text-[8px] font-black uppercase tracking-[0.4em] italic">v2.4 Live</span>
              </div>
              <p className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">Compute.</span>
              </p>
            </div>

            {/* Horizontal Technical HUD */}
            <div className="hidden lg:grid grid-cols-2 gap-x-6 gap-y-1 border-l border-white/10 pl-6 text-[8px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2 italic"> <div className="w-1 h-1 bg-blue-500 rounded-full" /> Hardware Isolation</div>
              <div className="flex items-center gap-2 italic"> <div className="w-1 h-1 bg-blue-500 rounded-full" /> Pune Datacenter</div>
              <div className="flex items-center gap-2 italic"> <div className="w-1 h-1 bg-blue-500 rounded-full" /> L6 Edge Network</div>
              <div className="flex items-center gap-2 italic"> <div className="w-1 h-1 bg-blue-500 rounded-full" /> Gen4 NVMe Array</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto mb-10">

            {/* THE CORE NODE - Glassmorphism */}
            <div className="reveal-left relative group bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-[2rem] p-8 flex flex-col transition-all duration-700 hover:bg-white/[0.03] hover:border-white/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-slate-500 text-[8px] font-black uppercase tracking-[0.4em] mb-1 italic">Shared Infrastructure</div>
                  <div className="text-5xl text-white font-black italic tracking-tighter leading-none">$6<span className="text-sm text-slate-700 ml-1">/mo</span></div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500">
                  <img src="https://xcloud.host/wp-content/uploads/2026/02/openclaw-1-1.png" className="w-6 h-6 object-contain" alt="OpenClaw" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-10 flex-grow">
                {[
                  { label: "vCPU", val: "2 Dedicated" },
                  { label: "Memory", val: "4GB Reserved" },
                  { label: "Storage", val: "50GB Gen4" },
                  { label: "Protocol", val: "Managed" },
                ].map((feat, i) => (
                  <div key={i} className="relative pl-3 border-l border-white/10">
                    <div className="text-[7px] text-slate-600 font-black uppercase tracking-widest italic mb-0.5">{feat.label}</div>
                    <div className="text-[10px] text-slate-300 font-bold uppercase italic tracking-tight">{feat.val}</div>
                  </div>
                ))}
              </div>
              <a href="/dashboard">
                <button className="w-full py-4 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 italic">Deploy now</button></a>
            </div>

            {/* THE UNLIMITED BEAST - High Gloss High Aura */}
            <div className="reveal-right relative group flex flex-col">
              {/* Animated Glow Backdrop */}
              <div className="absolute -inset-[1px] bg-gradient-to-tr from-blue-600 via-white/20 to-blue-400 rounded-[2.2rem] opacity-20 group-hover:opacity-60 transition duration-1000 blur-md" />

              <div className="relative h-full bg-[#05070A] border border-blue-500/30 backdrop-blur-2xl rounded-[2rem] p-8 flex flex-col z-10 transition-all duration-700 group-hover:border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.1)] overflow-hidden">
                {/* Internal Moving Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-transparent pointer-events-none" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 rounded mb-3">
                      <div className="h-1 w-1 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                      <span className="text-blue-500 text-[7px] font-black uppercase tracking-[0.3em] italic">Apex Managed</span>
                    </div>
                    <div className="text-7xl text-white font-black italic tracking-tighter leading-none">$15<span className="text-sm text-blue-500/40 ml-1">/mo</span></div>
                  </div>
                  <img src="https://xcloud.host/wp-content/uploads/2026/02/openclaw-1-1.png" className="w-12 h-12 object-contain animate-float drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]" alt="OpenClaw" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10 flex-grow relative z-10">
                  {["UNLIMITED CPU", "UNLIMITED RAM", "UNLIMITED CRONS", "150GB STORAGE", "MANAGED CORE", "ZERO-LIMITS"].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 group/item">
                      <div className="h-1 w-1 bg-blue-500 rounded-full group-hover/item:w-3 transition-all duration-500 shadow-[0_0_8px_#3b82f6]" />
                      <span className="text-[9px] text-white font-black uppercase tracking-widest italic group-hover/item:text-blue-400 transition-colors">{feat}</span>
                    </div>
                  ))}
                </div>

                <button className="relative w-full py-5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.5em] shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:shadow-blue-500/60 transition-all duration-500 overflow-hidden group/btn italic">
                  <span className="relative z-10">Boost Your Work Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                </button>
              </div>
            </div>
          </div>

          {/* --- COMPACT DEDICATED SLICE HUD --- */}
          <div className="max-w-4xl mx-auto border-t border-white/5 pt-8 reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.5em] italic">Dedicated Bare-Metal Slices</span>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-white/10 to-transparent" />
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                { name: "Compute Slice", spec: "4 vCPU / 16GB", price: "$35" },
                { name: "Memory Slice", spec: "8 vCPU / 32GB", price: "$65" },
                { name: "Apex Slice", spec: "16 vCPU / 64GB", price: "$115" }
              ].map((slice, i) => (
                <div key={i} className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:bg-white/[0.03] hover:border-blue-500/30 transition-all duration-500 reveal-scale" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div>
                    <h4 className="text-[9px] text-white font-black uppercase italic mb-0.5">{slice.name}</h4>
                    <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">{slice.spec}</p>
                  </div>
                  <div className="text-right font-black italic text-blue-500 text-xs group-hover:text-white transition-colors">{slice.price}/mo</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
    @keyframes shimmer { 100% { transform: translateX(100%); } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .reveal { opacity: 0; transform: translateY(20px); transition: all 1s ease-out; }
    .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 1s ease-out; }
    .reveal-right { opacity: 0; transform: translateX(30px); transition: all 1s ease-out; }
    .reveal-scale { opacity: 0; transform: scale(0.95); transition: all 0.8s ease-out; }
    .is-visible { opacity: 1; transform: translate(0) scale(1); }
  `}} />
      </section>

      {/* --- ELITE FEATURE CARDS --- */}
      <section id="compute" className="py-24 relative overflow-hidden bg-[#0B0D17]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 reveal">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-blue-500 text-xs font-black tracking-[0.5em] uppercase mb-4 italic">Core Infrastructure</h2>
              <p className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                Hardened <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">Orchestration</span>
              </p>
            </div>
            <div className="hidden md:block pb-2">
              <div className="flex gap-1 mb-2 justify-end italic font-black">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-1 bg-blue-600/20 rounded-full" />)}
              </div>
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic">System Protocol v4.0</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Isolated Runtimes", icon: <Cpu />, sub: "Deployment: 100%", val: "w-full", desc: "Kernel-level isolation for every bot. Your AI agents run in hardened micro-VMs, preventing cross-process interference." },
              { title: "Instant Provision", icon: <Workflow />, sub: "Speed: <12ms", val: "w-[80%]", desc: "Deploy OpenClaw instances in under 12 seconds. Pre-configured environments with all dependencies baked into the core kernel." },
              { title: "Atomic Security", icon: <Lock />, sub: "AES: 256-BIT", val: "w-[95%]", desc: "End-to-end AES-256 encryption for all node traffic. Secure your data pipelines from the edge to the core." }
            ].map((card, i) => (
              <div key={i} className="group relative reveal-scale" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition duration-500 blur-xl"></div>
                <div className="relative h-full bg-[#151926] border border-white/5 p-10 rounded-[2.5rem] flex flex-col transition-all duration-500 group-hover:-translate-y-2 group-hover:border-blue-500/30">
                  <div className="w-16 h-16 bg-[#0B0D17] border border-white/10 rounded-2xl flex items-center justify-center mb-10 shadow-2xl group-hover:border-blue-500/50 transition-colors">
                    {React.cloneElement(card.icon, { className: "text-blue-500 group-hover:scale-110 transition-transform duration-500", size: 32, strokeWidth: 1.5 })}
                  </div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-8 flex-grow italic">{card.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] italic">{card.sub}</span>
                    <div className="h-1 w-12 bg-blue-500/20 rounded-full overflow-hidden italic"><div className={`h-full ${card.val} bg-blue-500`}></div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="reveal"><TestimonialsSection /></div>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-[#0B0D17]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left italic reveal">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <img src="https://xcloud.host/wp-content/uploads/2026/02/openclaw-1-1.png" className="w-6 h-6 grayscale brightness-200" alt="logo" />
              <span className="text-sm font-black tracking-tighter text-white uppercase italic">BerryBox.cloud</span>
            </div>
            <p className="text-[11px] text-slate-600 max-w-sm font-black uppercase tracking-widest leading-loose mx-auto md:mx-0">Managed PaaS provided by BerryBox Cloud. <br /> Secure, redundant, and built for AI orchestration.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-blue-500 w-fit mx-auto md:mx-0 pb-1">Infrastructure</h4>
            <ul className="space-y-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <li className="hover:text-blue-500 transition cursor-pointer italic">Compute Regions</li>
              <li className="hover:text-blue-500 transition cursor-pointer italic">Network Stats</li>
              <li className="hover:text-blue-500 transition cursor-pointer italic">Core Kernel</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-blue-500 w-fit mx-auto md:mx-0 pb-1">Legal Protocol</h4>
            <ul className="space-y-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
              <li className="hover:text-blue-500 transition cursor-pointer italic">Privacy Policy</li>
              <li className="hover:text-blue-500 transition cursor-pointer italic">Node Security</li>
              <li className="hover:text-blue-500 transition cursor-pointer italic">Terms</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase text-slate-700 tracking-[0.5em] italic reveal">
          <span>© 2026 xCloud Hosting LLC. All Protocols Active.</span>
          <div className="flex gap-4"><Globe size={14} /><Activity size={14} /></div>
        </div>
      </footer>

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