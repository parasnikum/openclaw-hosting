import React from 'react';
import {
  Quote,
  Star,
  Zap,
  CheckCircle2,
  Users,
  Shield
} from 'lucide-react';

const TestimonialsSection = () => {
  const gridTestimonials = [
    { name: "Massimo Villa", role: "DevOps Lead", text: "Configuring a VPS used to be a project. With OpenClaw, I deployed 8 sites and bots in one afternoon. Silk smooth." },
    { name: "Waqar Ahmed", role: "AI Researcher", text: "This isn't just hosting. It's like having a friend who has your back when you screw things up bad." },
    { name: "Tony Lewis", role: "Fullstack Dev", text: "Dropped cPanel for this. The interface is the standout feature—clean, fast, and optimized for nodes." },
  ];

  const verticalTestimonials = [
    {
      name: "Brian Geovanny",
      role: "@braingigio",
      text: "Performance is surprising for a release version. I've tried RunCloud and ServerAvatar, Congratulations to the team!",
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
              {[...verticalTestimonials, ...verticalTestimonials, ...verticalTestimonials].map((t, i) => (
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
          <div className="lg:col-span-8 overflow-hidden relative">
            
            {/* Row 1: Left to Right movement */}
            <div className="group/horizontal overflow-hidden">
                <div className="flex items-center gap-2 mb-6 md:mb-8 opacity-50 relative z-20">
                <Zap size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Cluster Feedback</span>
                </div>

                <div className="flex w-max animate-horizontal-scroll gap-4 group-hover/horizontal:[animation-play-state:paused]">
                {[...gridTestimonials, ...gridTestimonials, ...gridTestimonials, ...gridTestimonials].map((t, i) => (
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
            </div>

            {/* Row 2: Right to Left (Reverse) movement */}
            <div className="mt-8 md:mt-12 group/horizontal-reverse overflow-hidden">
              <div className="flex items-center justify-end gap-2 mb-6 md:mb-8 opacity-50 relative z-20 px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white text-right">Community Insights</span>
                <Users size={16} className="text-emerald-500" />
              </div>

              <div className="flex w-max animate-horizontal-scroll-reverse gap-4 group-hover/horizontal-reverse:[animation-play-state:paused]">
                {[...gridTestimonials, ...gridTestimonials, ...gridTestimonials, ...gridTestimonials].map((t, i) => (
                  <div
                    key={`rev-${i}`}
                    className="w-[280px] md:w-[350px] p-5 md:p-6 bg-[#1C212E]/50 border border-white/5 rounded-2xl hover:bg-[#151926] transition-colors shadow-2xl shrink-0"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 font-black text-[10px] italic">
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
                    <div className="mt-4 flex items-center gap-1.5 text-blue-500 border-t border-white/5 pt-4">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Verified User</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes vertical-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes horizontal-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes horizontal-scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-vertical-scroll {
          animation: vertical-scroll 30s linear infinite;
        }
        .animate-horizontal-scroll {
          animation: horizontal-scroll 40s linear infinite;
        }
        .animate-horizontal-scroll-reverse {
          animation: horizontal-scroll-reverse 40s linear infinite;
        }
      ` }} />
    </section>
  );
};

export default TestimonialsSection;