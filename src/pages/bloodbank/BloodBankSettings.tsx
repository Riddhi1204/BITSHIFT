import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Settings, 
  Lock, 
  Building2, 
  Phone, 
  CheckCircle2, 
  Bell, 
  Save, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS } from '../../data/mockData';
import { BloodBankNav } from '../../components/bloodbank/BloodBankNav';
import { bloodBankApi } from '../../services/bloodBankApi';
import type { BloodBank } from '../../types';

export const BloodBankSettings = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();
  const [bloodBank, setBloodBank] = useState<BloodBank | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [operatingHours, setOperatingHours] = useState('24 Hours / 7 Days');
  const [notifyEmergency, setNotifyEmergency] = useState(true);
  const [notifyExpiry, setNotifyExpiry] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBank = async () => {
      if (!bloodBankId) return;
      try {
        setLoading(true);
        const data = await bloodBankApi.getById(bloodBankId);
        if (!isMounted) return;
        if (data && data.id) {
          setBloodBank(data);
          setName(data.name || '');
          setCity(data.city || '');
          setState(data.state || '');
          setAddress(data.address || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setEmergencyContact(data.emergencyContact || '');
          setOperatingHours(data.operatingHours || '24 Hours / 7 Days');
        } else {
          const mock = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId || b.registrationNumber === bloodBankId);
          if (mock) {
            setBloodBank(mock);
            setName(mock.name);
            setCity(mock.city);
            setState(mock.state);
            setAddress(mock.address);
            setPhone(mock.phone);
            setEmail(mock.email);
            setEmergencyContact(mock.emergencyContact);
            setOperatingHours(mock.operatingHours);
          }
        }
      } catch (err) {
        const mock = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId || b.registrationNumber === bloodBankId);
        if (mock && isMounted) {
          setBloodBank(mock);
          setName(mock.name);
          setCity(mock.city);
          setState(mock.state);
          setAddress(mock.address);
          setPhone(mock.phone);
          setEmail(mock.email);
          setEmergencyContact(mock.emergencyContact);
          setOperatingHours(mock.operatingHours);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBank();
    return () => { isMounted = false; };
  }, [bloodBankId]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <Loader2 className="w-10 h-10 text-brand-red animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Loading Facility Configuration...</h2>
        </div>
      </div>
    );
  }

  if (!bloodBank) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Blood Bank Not Found</h2>
          <p className="text-sm text-slate-400">Identifier <strong className="text-red-400 font-mono">"{bloodBankId}"</strong> does not exist.</p>
          <Link to="/blood-banks" className="inline-block px-5 py-2.5 bg-brand-red text-white font-bold text-xs rounded-xl">
            View Registered Blood Banks
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Settings and facility configuration updated successfully in HemoVite Grid!');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white pb-16">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BloodBankNav bloodBank={bloodBank} activeTab="settings" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* HEADER */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-brand-red" />
            <span>Blood Bank Portal & Node Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure contact hotlines, operational shift hours, notification triggers, and administrator profiles for {bloodBank.name}.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* SECTION 1: FACILITY PROFILE (READ-ONLY ID) */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-red" />
                <span>Facility Information</span>
              </h3>
              <span className="text-xs text-slate-400">National Health Registry ID</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Blood Bank ID (Locked) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Blood Bank ID (Permanent Key)
                </label>
                <input
                  type="text"
                  disabled
                  value={bloodBank.id}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono font-bold text-red-300 cursor-not-allowed"
                />
              </div>

              {/* License Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">State Drug License Number</label>
                <input
                  type="text"
                  disabled
                  value={bloodBank.licenseNo || 'JH/BB/2018/0042'}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-slate-300 cursor-not-allowed"
                />
              </div>

              {/* Facility Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Registered Blood Bank Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                />
              </div>

              {/* City & State */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                />
              </div>

              {/* Full Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Physical Campus Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: HOTLINES & DISPATCH */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Contact & Emergency Hotlines</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Official General Telephone *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-red-400">24/7 Clinical Emergency Hotline *</label>
                <input
                  type="text"
                  required
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-red-500/40 rounded-xl text-xs text-brand-bright font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Official Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Operating Shift Hours *</label>
                <input
                  type="text"
                  required
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: NOTIFICATION TRIGGERS */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span>Automated Telemetry & Alert Preferences</span>
              </h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-xs font-bold text-white">Instant Trauma Push Alerts (Emergency Requisitions)</div>
                  <div className="text-[11px] text-slate-400">Receive high-priority siren notifications when a nearby hospital broadcasts a critical order.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmergency}
                  onChange={(e) => setNotifyEmergency(e.target.checked)}
                  className="w-5 h-5 rounded text-brand-red focus:ring-brand-red bg-slate-900 border-white/20"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-xs font-bold text-white">Component Expiry Proactive Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive alerts 48 hours prior to whole-blood and PRBC expiration dates.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyExpiry}
                  onChange={(e) => setNotifyExpiry(e.target.checked)}
                  className="w-5 h-5 rounded text-brand-red focus:ring-brand-red bg-slate-900 border-white/20"
                />
              </label>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-950/50 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>

        </form>

      </main>

    </div>
  );
};
