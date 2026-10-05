import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building, MessageSquare, User, Sparkles } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', organization: '', message: '' });
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Healthcare Partnerships & Coordination
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Us
          </h2>
          <p className="text-base text-slate-600">
            Connect with our clinical integration engineers to link your hospital, blood bank, or state health dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: CONTACT INFO CARDS */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-36 h-36 bg-brand-red/20 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Headquarters</span>
                <h3 className="text-2xl font-black text-white">HemoVite Central Office</h3>
                <p className="text-xs text-slate-300">
                  National Blood & AI Resource Coordination Network
                </p>
              </div>

              <div className="space-y-5 pt-2 text-sm text-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-red-400 border border-white/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Email Address</div>
                    <a href="mailto:support@bloodguard.ai" className="font-semibold text-white hover:text-red-400 transition-colors">
                      support@bloodguard.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-blue-400 border border-white/10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Direct Helpline</div>
                    <div className="font-semibold text-white">
                      +91 1800 233 4567 / +91 98765 43210
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-400 border border-white/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Location</div>
                    <div className="font-semibold text-white">
                      New Delhi & National Health Grid Hubs, India
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Response SLA: &lt; 2 Hours</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Support Active
                </span>
              </div>
            </div>

            {/* QUICK LINK CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Are you a Hospital Administrator?</h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Connect your HL7/FHIR EHR feeds directly to BloodGuard AI for automated shortage early warnings.
              </p>
              <span className="text-xs font-bold text-brand-red inline-flex items-center gap-1">
                Fast-track onboarding: api-integration@bloodguard.ai
              </span>
            </div>

          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-card-soft">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Message Sent Successfully</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. A HemoVite clinical coordinator will contact your organization shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Rajesh Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red text-sm transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@hospital.org"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> Organization / Hospital Name
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. City General Hospital / Rotary Blood Center"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red text-sm transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, blood bank integration requirements, or partnership request..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red text-sm transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-lg shadow-red-950/20 hover:shadow-brand-red/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
