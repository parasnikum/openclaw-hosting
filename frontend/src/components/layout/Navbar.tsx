import React, { useState } from 'react';
import { LayoutDashboard, ChevronDown, Menu, X, Rocket } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);

  return (
    <nav className="border-b border-white/10 sticky top-0 bg-[#0B0D17]/95 backdrop-blur-md z-[100] w-full">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3">
          <div className="bg-[#1C212E] p-2 rounded-xl border border-white/10 shadow-lg">
            <img 
              src="Berry_Box_Logo.png" 
              className="w-7 h-7 object-contain" 
              alt="Logo" 
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            BerryBox<span className="text-blue-500">.Cloud</span>
          </span>
        </div>

        {/* DESKTOP CENTER LINKS */}
        <div className="hidden lg:flex gap-8 text-[14px] font-medium text-slate-300 items-center">
          <div className="group relative cursor-pointer py-2">
            <span className="hover:text-white transition flex items-center gap-1">
              Applications 
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200 opacity-50" />
            </span>
            {/* Desktop Dropdown */}
            <div className="absolute left-0 mt-4 w-56 bg-[#0B0D17] border border-white/10 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
              <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors group/item">
                <img className='w-5 h-5 object-contain' src="openclaw.png" alt="openclaw"/> 
                <span>Openclaw</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </a>
            </div>
          </div>
          <a href="/#pricing" className="hover:text-white transition">Pricing</a>
          <a href="/#features" className="hover:text-white transition">Features</a>
        </div>

        {/* ACTION BUTTONS & MOBILE TOGGLE */}
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="/login" className="hidden lg:block text-[14px] font-medium text-slate-300 hover:text-white transition">
            Log In
          </a>
          <a href="/dashboard" className="bg-blue-600 text-white hover:bg-blue-500 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95">
            <span className="hidden xs:inline">Dashboard</span> <LayoutDashboard size={16} />
          </a>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white transition"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0B0D17] border-b border-white/10 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-4">
            <button 
              onClick={() => setIsAppDropdownOpen(!isAppDropdownOpen)}
              className="flex items-center justify-between w-full text-lg font-semibold text-white"
            >
              Applications
              <ChevronDown size={20} className={`transition-transform ${isAppDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isAppDropdownOpen && (
              <div className="pl-4 space-y-4 animate-fade-in">
                <a href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition">
                  <img className='w-5 h-5' src="openclaw.png" alt="openclaw"/> Openclaw
                </a>
                <span className="flex items-center gap-3 text-slate-600 cursor-not-allowed">
                  n8n <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded">Soon</span>
                </span>
              </div>
            )}
            
            <a href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-white">Pricing</a>
            <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-white">Features</a>
          </div>

          <div className="pt-6 border-t border-white/10">
            <a href="/login" className="flex items-center gap-2 text-slate-300 font-medium">
              Log In <Rocket size={16} className="text-blue-500" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};