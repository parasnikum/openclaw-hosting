import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicy() {
    const lastUpdated = "February 16, 2026";

    const sections = [
        {
            title: "Data Collection",
            icon: <Eye className="text-blue-500" size={20} />,
            content: "We collect information you provide directly to us when you create an account, such as your name, email address, and payment information. We also collect technical data including IP addresses and browser types to ensure secure orchestration of your nodes."
        },
        {
            title: "How We Use Data",
            icon: <Shield className="text-blue-500" size={20} />,
            content: "Your data is used to provide, maintain, and improve BerryBox services. Specifically, we use your information to manage your OpenClaw instances, process payments, and protect against fraudulent or illegal activity on our infrastructure."
        },
        {
            title: "Security Protocols",
            icon: <Lock className="text-blue-500" size={20} />,
            content: "We implement AES-256 encryption for all data pipelines. Your credentials and API keys are stored in hardened, isolated environments. We never store raw passwords; all authentication is handled via secure cryptographic hashing."
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#030509] text-slate-300 font-sans selection:bg-blue-500/30">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
                    {/* HEADER */}
                    <div className="text-center mb-20 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
                            <Shield size={14} className="text-blue-500" />
                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Legal Protocol</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                            Privacy <span className="text-slate-500">Policy.</span>
                        </h1>
                        <p className="text-slate-500 text-sm">Last updated: {lastUpdated}</p>
                    </div>

                    {/* CORE SECTIONS */}
                    <div className="grid gap-6 mb-16">
                        {sections.map((section, i) => (
                            <div key={i} className="bg-[#0B0D17] border border-white/5 rounded-2xl p-8 hover:border-blue-500/20 transition-all group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                </div>
                                <p className="leading-relaxed text-slate-400">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* DETAILED CONTENT */}
                    <div className="prose prose-invert max-w-none space-y-12 text-slate-400">
                        <section>
                            <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                                <ChevronRight className="text-blue-500" size={20} />
                                Third-Party Services
                            </h3>
                            <p>
                                BerryBox utilizes third-party providers for payment processing (Razorpay) and infrastructure hosting.
                                These providers have access to your personal information only to perform specific tasks on our behalf
                                and are obligated not to disclose or use it for any other purpose.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                                <ChevronRight className="text-blue-500" size={20} />
                                Cookies & Tracking
                            </h3>
                            <p>
                                We use functional cookies to maintain your session and remember your preferences (like Dark Mode).
                                We do not use tracking cookies for advertising purposes. You can instruct your browser to refuse
                                all cookies, but some portions of our service may become inaccessible.
                            </p>
                        </section>

                        <section className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-8">
                            <h3 className="text-white text-2xl font-bold mb-4">Contact Our Legal Team</h3>
                            <p className="mb-6">
                                If you have any questions regarding this Privacy Policy or how your data is handled, please reach out
                                to our data protection officer.
                            </p>
                            <a href="mailto:legal@berrybox.cloud">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm uppercase tracking-widest">
                                    Email Support
                                </button>
                            </a>
                        </section>
                    </div>

                </div>
            </div>
            <Footer />

        </>
    );
}