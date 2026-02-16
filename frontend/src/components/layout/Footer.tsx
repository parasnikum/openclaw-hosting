import React from 'react';
import { Activity, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <>
      <footer className="py-20 border-t border-white/5 bg-[#0B0D17]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left italic reveal">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <img src="Berry_Box_Logo.png" className="w-7 h-7" alt="logo" />
              <span className="text-sm font-black tracking-tighter text-white uppercase italic">BerryBox.cloud</span>
            </div>
            <p className="text-[11px] text-slate-600 max-w-sm font-black uppercase tracking-widest leading-loose mx-auto md:mx-0">Managed PaaS provided by BerryBox Cloud. <br /> Secure, redundant, and built for AI orchestration.</p>
          </div>
          {/* <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-blue-500 w-fit mx-auto md:mx-0 pb-1">Infrastructure</h4>
            <ul className="space-y-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <li className="hover:text-blue-500 transition cursor-pointer italic">Compute Regions</li>
              <li className="hover:text-blue-500 transition cursor-pointer italic">Network Stats</li>
              <li className="hover:text-blue-500 transition cursor-pointer italic">Core Kernel</li>
            </ul>
          </div> */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-blue-500 w-fit mx-auto md:mx-0 pb-1">Legal Protocol</h4>
            <ul className="space-y-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
              <li className="hover:text-blue-500 transition cursor-pointer italic"><a href='/privacy'> Privacy Policy</a></li>
              <li className="hover:text-blue-500 transition cursor-pointer italic"><a href="/terms">Terms </a></li>
              <li className="hover:text-blue-500 transition cursor-pointer italic"><a href="/refund">Refund Policy </a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase text-slate-700 tracking-[0.5em] italic reveal">
          <span>© 2026 BerryBox.cloud</span>
          <div className="flex gap-4"><Globe size={14} /><Activity size={14} /></div>
        </div>
      </footer>
    </>
  );
};