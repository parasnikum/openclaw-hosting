import React from 'react';
import { RefreshCcw, ShieldCheck, Zap, AlertTriangle, FileText, ChevronRight, CheckCircle2, Info } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function RefundPolicy() {
    const lastUpdated = "February 16, 2026";

    const mainPillars = [
        {
            title: "24-Hour Zero-Risk",
            icon: <Zap className="text-blue-500" size={20} />,
            content: "Complete 100% refund for any reason within the first 24 hours of your initial subscription. No questions asked, provided usage remains under our fair-test threshold (1% of compute)."
        },
        {
            title: "SLA Guarantee",
            icon: <ShieldCheck className="text-blue-500" size={20} />,
            content: "If our infrastructure uptime drops below 99.9%, we provide prorated service credits or partial refunds based on the total impact on your orchestrated nodes."
        },
        {
            title: "Automated Reversals",
            icon: <RefreshCcw className="text-blue-500" size={20} />,
            content: "Refunds for accidental double-billing or technical gateway errors are processed automatically by our financial protocol within 48 business hours."
        }
    ];

    const advancedClauses = [
        {
            category: "Eligibility", points: [
                "24-Hour full refund applies only to first-time customers.",
                "Refund requests must be timestamped within 1,440 minutes of purchase.",
                "Usage of more than 1GB of egress data voids the instant refund.",
                "Simultaneous deployment of 5+ nodes voids the 24-hour window.",
                "Apex Bare-Metal Slices are exempt from the 24-hour full refund.",
                "Account must be in good standing with no active abuse reports.",
                "Trial credits are non-convertible to cash refunds."
            ]
        },
        {
            category: "Infrastructure & Compute", points: [
                "Refunds are not granted for bot-code errors or script failures.",
                "Network latency fluctuations under 100ms are not grounds for refund.",
                "Third-party API failures (OpenAI, etc.) do not qualify for credits.",
                "Unused compute hours do not roll over or convert to refunds.",
                "Hardware upgrades during a cycle are non-refundable.",
                "Server migrations required for security are not compensable.",
                "Force Majeure events (Global outages) follow SLA credit logic."
            ]
        },
        {
            category: "Financial Protocols", points: [
                "Refunds are returned strictly to the original payment source.",
                "Currency conversion fees are handled by the user's bank.",
                "Crypto-payment refunds are processed at current market value.",
                "Chargebacks will result in immediate and permanent account blacklisting.",
                "Prorated refunds are calculated by the hour, not the day.",
                "Administrative fees may apply for manual wire-transfer reversals.",
                "Promotional discounts are deducted from the final refund amount."
            ]
        },
        {
            category: "Account & Compliance", points: [
                "Violation of Acceptable Use Policy (AUP) voids all refund rights.",
                "Resource mining (Crypto-mining) leads to immediate seizure without refund.",
                "Identity mismatch between billing and account leads to a hold.",
                "Multiple accounts created to game the 24-hour policy are banned.",
                "Compliance with Pune Datacenter local laws is mandatory for claims.",
                "Refunds are not issued for 'change of mind' after the 24-hour mark.",
                "Legacy plans (v1.0) follow their original 2024 refund terms."
            ]
        }
    ];

    return (
        <>
        <Navbar />
            <div className="min-h-screen bg-[#030509] text-slate-300 font-sans selection:bg-blue-500/30 pb-20">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-full h-[600px] bg-blue-600/5 blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-full h-[600px] bg-indigo-600/5 blur-[120px]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">

                    {/* HEADER SECTION */}
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
                            <Zap size={14} className="text-blue-400 fill-blue-400 animate-pulse" />
                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em]">Billing Protocol v2.4</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                            Refund <span className="text-slate-500">Architecture.</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
                            Last Revision: {lastUpdated} • <span className="text-blue-500">24-Hour Full Guarantee</span>
                        </p>
                    </div>

                    {/* TOP 3 PILLARS */}
                    <div className="grid md:grid-cols-3 gap-6 mb-24">
                        {mainPillars.map((pillar, i) => (
                            <div key={i} className="bg-[#0B0D17] border border-white/5 rounded-3xl p-8 flex flex-col transition-all hover:border-blue-500/20 group">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    {pillar.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white mb-4 tracking-tight">{pillar.title}</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">{pillar.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* ADVANCED 25+ POINTS GRID */}
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 mb-24">
                        {advancedClauses.map((section, i) => (
                            <div key={i} className="space-y-6">
                                <h3 className="text-white text-xs font-black uppercase tracking-[0.4em] border-l-2 border-blue-500 pl-4">
                                    {section.category}
                                </h3>
                                <div className="space-y-4">
                                    {section.points.map((point, j) => (
                                        <div key={j} className="flex items-start gap-3 group">
                                            <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                                            <p className="text-[13px] text-slate-400 leading-snug group-hover:text-slate-200 transition-colors">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* WARNING FOOTNOTE */}
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 mb-24 flex items-center gap-6">
                        <AlertTriangle className="text-amber-500 shrink-0" size={32} />
                        <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                            <strong className="text-amber-500 uppercase tracking-widest block mb-1">System Advisory:</strong>
                            Attempts to exploit the 24-hour refund window by spinning up high-resource instances for temporary scraping or mining tasks will be flagged by our heuristic monitoring. Accounts identified as "hit-and-run" will be ineligible for the 100% refund protocol.
                        </p>
                    </div>

                    {/* CTA SUPPORT SECTION */}
                    <div className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-16 text-center">
                        <h2 className="text-white text-3xl font-bold mb-4 tracking-tight">Need a manual review?</h2>
                        <p className="text-slate-500 text-sm max-w-md mb-10 leading-relaxed">
                            If your situation is unique and doesn't fit the automated protocols above, our human billing experts are available for a private consultation.
                        </p>
                        <a href="mailto:billing@berrybox.cloud">
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-2xl transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20">
                                Open Billing Ticket
                            </button>
                        </a>
                    </div>

                    {/* LEGAL FOOTER */}
                    <div className="mt-20 text-center space-y-4">
                        <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.6em]">
                            BERRYBOX CLOUD • GLOBAL INFRASTRUCTURE COMPLIANCE
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}