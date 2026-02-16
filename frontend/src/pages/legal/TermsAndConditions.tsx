import React from 'react';
import {
    ShieldAlert,
    Scale,
    ArrowLeft,
    Lock,
    Zap,
    Info,
    ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const TermsAndConditions = () => {
    const sections = [
        {
            id: "provision",
            title: "01. Provision of Service",
            icon: <Zap size={18} />,
            content: "Service availability is targeted at 99.99%. Users acknowledge that 'BerryBox.cloud' reserves the right to suspend nodes that exceed 200% of their allocated I/O burst for extended periods to maintain network integrity."
        },
        {
            id: "aup",
            title: "02. Acceptable Use Policy (AUP)",
            icon: <ShieldAlert size={18} />,
            content: "Users are strictly prohibited from utilizing OpenClaw nodes for: DDoS attacks, illegal crypto-mining, hosting malware, or bypassing regional API restrictions. Unauthorized 'Kernel-level' manipulation attempts will result in immediate account termination without refund."
        },
        {
            id: "security",
            title: "03. Data Isolation & Security",
            icon: <Lock size={18} />,
            content: "Every node is provisioned within a hardware-isolated environment. While we employ AES-256 encryption at the edge, users are responsible for the security of their own API keys and agentic logic. We do not inspect user data unless compelled by a legal warrant."
        },
        {
            id: "billing",
            title: "04. Billing & Refund Protocol",
            icon: <Scale size={18} />,
            content: "Compute slices are billed monthly. Cancellations must be initiated 24 hours prior to the next billing cycle. Due to the high-performance nature of bare-metal resource reservation, partial refunds are not issued for 'active' compute time."
        }
    ];


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0B0D17] text-slate-300 font-sans selection:bg-blue-600/30">
                {/* SIMPLE NAV */}
                <nav className="border-b border-white/5 bg-[#0B0D17] sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <a href="/" className="flex items-center gap-2 text-white hover:text-blue-500 transition-colors">
                            <ArrowLeft size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Exit to App</span>
                        </a>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                            Revision: 2026.02.16
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* LEFT SIDEBAR: QUICK LINKS / SUB-POINTS */}
                        <aside className="lg:w-64 shrink-0">
                            <div className="sticky top-28 space-y-8">
                                <div>
                                    <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Info size={14} className="text-blue-500" /> Quick Navigation
                                    </h3>
                                    <nav className="space-y-1">
                                        {sections.map((s) => (
                                            <a
                                                key={s.id}
                                                href={`#${s.id}`}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 group transition-all"
                                            >
                                                <span className="text-[11px] font-bold uppercase tracking-tight text-slate-500 group-hover:text-blue-400">
                                                    {s.title.split('.')[1]}
                                                </span>
                                                <ChevronRight size={12} className="text-slate-700 group-hover:text-blue-500" />
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <h4 className="text-white text-[9px] font-black uppercase mb-2">Need Help?</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-4 italic">
                                        Questions regarding our legal protocol? Contact our Pune-based compliance team.
                                    </p>
                                    <button className="w-full py-2 text-[9px] font-black uppercase tracking-widest bg-white/5 hover:bg-blue-600 hover:text-white transition-all rounded">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* MAIN CONTENT: READABLE TEXT */}
                        <main className="flex-grow max-w-3xl">
                            <header className="mb-12">
                                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic mb-4">
                                    Terms of Service
                                </h1>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xl italic uppercase font-bold tracking-tight">
                                    Please read these terms carefully before deploying your infrastructure.
                                    Using our services implies full agreement with these protocols.
                                </p>
                            </header>

                            <div className="space-y-16">
                                {sections.map((section) => (
                                    <section key={section.id} id={section.id} className="scroll-mt-28">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-8 w-8 rounded bg-blue-600/10 flex items-center justify-center text-blue-500">
                                                {section.icon}
                                            </div>
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <div className="pl-11">
                                            <p className="text-slate-400 text-[13px] leading-7 font-medium tracking-wide">
                                                {section.content}
                                            </p>
                                            <div className="mt-6 h-px w-full bg-gradient-to-r from-white/5 to-transparent" />
                                        </div>
                                    </section>
                                ))}
                            </div>

                            {/* SIMPLE ACTION FOOTER */}
                            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Acceptance required to proceed</p>
                                    <p className="text-[9px] text-slate-600 uppercase tracking-tight">OpenClaw Cloud Interface v2.4</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-white hover:text-black transition-all">
                                        I Accept Terms
                                    </button>
                                </div>
                            </div>
                        </main>

                    </div>
                </div>
            </div>
            < Footer />
        </>
    );
};

export default TermsAndConditions;