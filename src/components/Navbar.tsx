import { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Droplet, 
  Landmark, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Activity, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  onSelectRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
  onOpenFinder: () => void;
}

export const Navbar = ({ onSelectRole, onOpenEmergency, onOpenFinder }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleClick = (role: UserRole) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    onSelectRole(role);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0B1220]/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3' 
        : 'bg-[#0B1220]/80 backdrop-blur-sm border-b border-white/5 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: SIMPLIFIED BRANDING [LOGO] HEMOVITE [AI] */}
          <div 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep text-white shadow-lg shadow-brand-red/30 group-hover:scale-105 transition-transform duration-300">
              {/* Blood Drop & Heartbeat Icon */}
              <div className="relative">
                <Droplet className="w-6 h-6 text-white fill-white" />
                <Activity className="w-3.5 h-3.5 text-brand-blue absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-bright"></span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                Hemo<span className="text-brand-bright">Vite</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-brand-blue/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
          </div>

          {/* CENTER: DESKTOP NAVIGATION MENU (Home | Select your Access | Contact Us) */}
          <nav className="hidden lg:flex items-center gap-9">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-sm font-medium text-slate-200 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-red hover:after:w-full after:transition-all"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('access')} 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-red hover:after:w-full after:transition-all"
            >
              Select your Access
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-red hover:after:w-full after:transition-all"
            >
              Contact Us
            </button>
          </nav>

          {/* RIGHT: ACTION BUTTONS & LOGIN DROPDOWN (Find Blood | Emergency Request | Login / Register ▼) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Find Blood Trigger */}
            <button
              onClick={onOpenFinder}
              className="text-xs font-semibold px-3 py-2 text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5 text-red-400" />
              <span>Find Blood</span>
            </button>

            {/* Emergency CTA */}
            <button
              onClick={onOpenEmergency}
              className="text-xs font-semibold px-3.5 py-2 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all shadow-md shadow-red-900/30 flex items-center gap-1.5 animate-pulse-subtle"
            >
              <AlertCircle className="w-3.5 h-3.5 text-white" />
              <span>Emergency Request</span>
            </button>

            {/* LOGIN / REGISTER DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md ${
                  dropdownOpen
                    ? 'bg-brand-red text-white ring-2 ring-brand-red/50 shadow-glow-red'
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <span>Login / Register</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Access Portal
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    {/* 1. Hospital */}
                    <button
                      onClick={() => handleRoleClick('hospital')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-gradient-to-r hover:from-brand-deep hover:to-brand-red hover:text-white transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-brand-red flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs leading-none">Hospital</div>
                        <div className="text-[11px] text-slate-400 group-hover:text-red-100 mt-1">Clinical Demand & Orders</div>
                      </div>
                    </button>

                    {/* 2. Blood Bank */}
                    <button
                      onClick={() => handleRoleClick('blood_bank')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-gradient-to-r hover:from-brand-deep hover:to-brand-red hover:text-white transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-brand-red flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs leading-none">Blood Bank</div>
                        <div className="text-[11px] text-slate-400 group-hover:text-red-100 mt-1">Inventory & Expiry Control</div>
                      </div>
                    </button>

                    {/* 3. Government Administrator */}
                    <button
                      onClick={() => handleRoleClick('government')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-gradient-to-r hover:from-brand-deep hover:to-brand-red hover:text-white transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs leading-none">Government Admin</div>
                        <div className="text-[11px] text-slate-400 group-hover:text-blue-100 mt-1">Regional Heatmaps & Policy</div>
                      </div>
                    </button>

                    {/* 4. Citizen */}
                    <button
                      onClick={() => handleRoleClick('citizen')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-gradient-to-r hover:from-brand-deep hover:to-brand-red hover:text-white transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs leading-none">Citizen / Donor</div>
                        <div className="text-[11px] text-slate-400 group-hover:text-emerald-100 mt-1">Seek Blood or Donate</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* MOBILE MENU TOGGLE & EMERGENCY */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenEmergency}
              className="text-xs px-2.5 py-1.5 bg-brand-red text-white font-semibold rounded-md"
            >
              Emergency
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1220] border-b border-white/10 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2 border-b border-white/10 pb-4">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-left text-sm font-medium text-slate-200 hover:text-white py-2"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('access')} 
              className="text-left text-sm font-medium text-slate-200 hover:text-white py-2"
            >
              Select your Access
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-left text-sm font-medium text-slate-200 hover:text-white py-2"
            >
              Contact Us
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFinder();
              }} 
              className="text-left text-sm font-medium text-red-400 hover:text-red-300 py-2 flex items-center gap-2"
            >
              <Droplet className="w-4 h-4" />
              <span>Find Blood Units</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Login or Register By Role
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRoleClick('hospital')}
                className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-semibold"
              >
                <Building2 className="w-4 h-4 text-red-400" />
                <span>Hospital</span>
              </button>
              <button
                onClick={() => handleRoleClick('blood_bank')}
                className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-semibold"
              >
                <Droplet className="w-4 h-4 text-red-400" />
                <span>Blood Bank</span>
              </button>
              <button
                onClick={() => handleRoleClick('government')}
                className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-semibold"
              >
                <Landmark className="w-4 h-4 text-blue-400" />
                <span>Government</span>
              </button>
              <button
                onClick={() => handleRoleClick('citizen')}
                className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-semibold"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Citizen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
