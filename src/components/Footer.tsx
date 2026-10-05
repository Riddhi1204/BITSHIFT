import { Droplet, Shield, ArrowUp } from 'lucide-react';
import type { UserRole } from '../types';

interface FooterProps {
  onSelectRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
}

export const Footer = ({ onSelectRole, onOpenEmergency }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B1220] text-white border-t border-white/10 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-COLUMN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* COLUMN 1: BRAND */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep text-white shadow-lg">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Hemo<span className="text-brand-bright">Vite</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-brand-blue/20 text-blue-400 border border-blue-500/30 rounded-full">
                BloodGuard AI
              </span>
            </div>

            <p className="text-sm font-semibold text-brand-bright italic">
              “Predict. Prevent. Save Lives.”
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              AI-powered blood shortage prediction and coordination platform connecting hospitals, blood banks, government health agencies, and citizens in real time.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> HIPAA / CDSCO Compliant Architecture
              </span>
            </div>
          </div>

          {/* COLUMN 2: PLATFORM */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('access')} className="hover:text-white transition-colors">
                  Select your Access
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('prediction')} className="hover:text-white transition-colors">
                  AI Prediction
                </button>
              </li>
              <li>
                <button onClick={onOpenEmergency} className="text-red-400 hover:text-red-300 transition-colors font-semibold">
                  Emergency Requests
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: ACCESS */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Access
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectRole('hospital')} className="hover:text-white transition-colors">
                  Hospital Portal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('blood_bank')} className="hover:text-white transition-colors">
                  Blood Bank Portal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('government')} className="hover:text-white transition-colors">
                  Government Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('citizen')} className="hover:text-white transition-colors">
                  Citizen & Donor Hub
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: SUPPORT */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <a href="#help" onClick={(e) => { e.preventDefault(); alert('24/7 Clinical Helpdesk is reachable at support@bloodguard.ai or Toll-Free 1800-BLOOD-911'); }} className="hover:text-white transition-colors">
                  Help Center & FAQs
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('HemoVite enforces strict RLS (Row Level Security) and never publishes personal donor contact information publicly.'); }} className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Predictive AI assists authorized healthcare decisions with human coordinator sign-off.'); }} className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-300">HemoVite</strong>. All Rights Reserved.
          </div>

          <div className="text-slate-400 font-medium">
            “Built for smarter healthcare coordination.”
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
