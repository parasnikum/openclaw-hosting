import React from 'react';
import { 
  Quote, 
  Star, 
  MessageSquare, 
  Zap, 
  CheckCircle2,
  Shield
} from 'lucide-react';

const TestimonialsSection = () => {
  const gridTestimonials = [
    { name: "Massimo Villa", role: "DevOps Lead", text: "Configuring a VPS used to be a project. With OpenClaw, I deployed 8 sites and bots in one afternoon. Silk smooth." },
    { name: "Waqar Ahmed", role: "AI Researcher", text: "xCloud isn't just hosting. It's like having a friend who has your back when you screw things up bad." },
    { name: "Tony Lewis", role: "Fullstack Dev", text: "Dropped cPanel for this. The interface is the standout feature—clean, fast, and optimized for nodes." },
    { name: "Leo Koo", role: "Automation Architect", text: "Moving 150 sites to xCloud. Faster performance and better pricing than Cloudways by a mile." },
  ];

  const verticalTestimonials = [
    { 
      name: "Brian Geovanny", 
      role: "@braingigio", 
      text: "Performance is surprising for a release version. I've tried RunCloud and ServerAvatar, but xCloud's roadmap for AI nodes is far more promising. Congratulations to the team!",
      metric: "Uptime: 100%"
    },
    { 
      name: "Rahul Singh", 
      role: "Node Operator", 
      text: "Trust me, once people explore the potential here, they will switch from other panels. Just keep delivering the best tech.",
      metric: "Latency: -40%"
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-[#0B0D17] border-t border-white/5 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-blue-500 text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 italic">Social Proof</h2>
          <p className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Engineered For <span className="text-slate-500">Stability.</span></p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* --- LEFT: VERTICAL AUTO-SCROLLING --- */}
          <div className="hidden lg:block lg:col-span-4 h-[600px] overflow-hidden relative group/vertical">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#0B0D17] to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0B0D17] to-transparent z-10"></div>
            
            <div className="flex items-center gap-2 mb-8 opacity-50 relative z-20">
                <Shield size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">In-Depth Case Studies</span>
            </div>
            
            <div className="animate-vertical-scroll space-y-6 group-hover/vertical:[animation-play-state:paused]">
              {[...verticalTestimonials, ...verticalTestimonials].map((t, i) => (
                <div key={i} className="relative bg-[#151926]/50 border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all shadow-lg">
                  <Quote className="absolute top-6 right-8 text-blue-500/10" size={40} />
                  <div className="flex items-center gap-1 mb-4 text-blue-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-400 italic mb-8 leading-relaxed text-sm">"{t.text}"</p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                      <div className="text-white font-black uppercase tracking-tighter italic text-sm">{t.name}</div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{t.role}</div>
                    </div>
                    <div className="bg-blue-500/10 px-3 py-1 rounded text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/20">
                      {t.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: HORIZONTAL AUTO-SCROLLING GRID --- */}
          <div className="lg:col-span-8 overflow-hidden relative group/horizontal">
            <div className="flex items-center gap-2 mb-6 md:mb-8 opacity-50 relative z-20">
                <Zap size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Cluster Feedback</span>
            </div>
            
            <div className="flex w-max animate-horizontal-scroll gap-4 group-hover/horizontal:[animation-play-state:paused]">
              {[...gridTestimonials, ...gridTestimonials, ...gridTestimonials].map((t, i) => (
                <div key={i} className="w-[280px] md:w-[350px] p-5 md:p-6 bg-[#1C212E] border border-white/5 rounded-2xl hover:bg-[#151926] transition-colors shadow-2xl shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-black text-[10px] italic">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold text-[10px] md:text-xs uppercase tracking-tight italic">{t.name}</div>
                      <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed font-medium min-h-[44px]">
                    {t.text}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-emerald-500 border-t border-white/5 pt-4">
                    <CheckCircle2 size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified Instance</span>
                  </div>
                </div>
              ))}
            </div>

            {/* --- RESPONSIVE CTA BOX --- */}
            <div className="mt-8 md:mt-12 p-6 md:p-10 bg-gradient-to-r from-[#1C212E] to-[#151926] rounded-2xl md:rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20 shadow-2xl group/cta cursor-pointer hover:border-blue-500/20 transition-all">
               <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6">
                 <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
                    <MessageSquare size={24} className="md:size-[32px] text-white" />
                 </div>
                 <div>
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-lg md:text-xl md:underline md:decoration-blue-500/40 md:underline-offset-8">Join the 10,000+ Node Operators</h4>
                    <p className="text-slate-500 text-xs md:text-sm font-medium italic mt-1 md:mt-2">Rated 5 Stars on Trustpilot across 280+ reviews.</p>
                 </div>
               </div>
               <button className="w-full md:w-auto bg-blue-600 border border-blue-500/20 hover:bg-white hover:text-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group-hover/cta:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
                  Launch Your Node
               </button>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vertical-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes horizontal-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-vertical-scroll {
          animation: vertical-scroll 30s linear infinite;
        }
        .animate-horizontal-scroll {
          animation: horizontal-scroll 50s linear infinite;
        }
      ` }} />
    </section>
  );
};

export default TestimonialsSection;