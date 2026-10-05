import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Send 
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS, MOCK_DONORS } from '../../data/mockData';
import { BloodBankNav } from '../../components/bloodbank/BloodBankNav';
import type { DonorProfile } from '../../types';

export const BloodBankDonors = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();
  const bloodBank = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId);

  const [donors] = useState<DonorProfile[]>(MOCK_DONORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible' | 'due_soon' | 'not_eligible'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  if (!bloodBank) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Blood Bank Not Found</h2>
          <Link to="/blood-banks" className="inline-block px-5 py-2.5 bg-brand-red text-white font-bold text-xs rounded-xl">
            View Registered Blood Banks
          </Link>
        </div>
      </div>
    );
  }

  const handleBroadcastAlert = (donor: DonorProfile) => {
    triggerToast(`Emergency donation broadcast SMS dispatched to ${donor.name} (${donor.phone})!`);
  };

  const filteredDonors = donors.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.bloodGroup.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q);

    const matchesFilter =
      eligibilityFilter === 'all' ? true : d.eligibility === eligibilityFilter;

    return matchesSearch && matchesFilter;
  });

  const eligibleCount = donors.filter((d) => d.eligibility === 'eligible').length;

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white pb-16">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BloodBankNav bloodBank={bloodBank} activeTab="donors" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-emerald-400" />
              <span>Registered Donor Registry</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active voluntary donors connected to {bloodBank.name} across Ranchi and neighboring districts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{eligibleCount} Donors Eligible Today</span>
            </span>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor by name, blood group (e.g. O-), phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: `All (${donors.length})` },
                { id: 'eligible', label: '🟢 Eligible Now' },
                { id: 'due_soon', label: '🟡 Due Soon' },
                { id: 'not_eligible', label: '🔴 Recovery Period' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setEligibilityFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    eligibilityFilter === f.id
                      ? 'bg-brand-red text-white shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

          </div>

          {/* TABLE (Requirement 15) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/5">
                  <th className="py-3.5 px-4 rounded-l-xl">Donor Profile</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Phone / Contact</th>
                  <th className="py-3.5 px-4">Last Donation</th>
                  <th className="py-3.5 px-4">Total Donations</th>
                  <th className="py-3.5 px-4">Eligibility Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{donor.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({donor.id})</span>
                        </div>
                        <span className="text-xs text-slate-400 block">
                          {donor.gender}, {donor.age} yrs • {donor.city}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg font-black text-xs bg-red-950 text-red-300 border border-red-600/50">
                        {donor.bloodGroup}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs font-mono text-slate-300">
                      <div>{donor.phone}</div>
                      <div className="text-[10px] text-slate-500">{donor.email}</div>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-300">
                      {donor.lastDonation}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-white">
                      {donor.totalDonations} Donations
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            donor.eligibility === 'eligible'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : donor.eligibility === 'due_soon'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>
                            {donor.eligibility === 'eligible'
                              ? '🟢 Eligible'
                              : donor.eligibility === 'due_soon'
                              ? '🟡 Due Soon'
                              : '🔴 In Recovery'}
                          </span>
                        </span>
                        <div className="text-[10px] text-slate-400">{donor.nextEligibleDate}</div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {donor.eligibility === 'eligible' && (
                          <button
                            onClick={() => handleBroadcastAlert(donor)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white text-xs font-bold shadow flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Notify</span>
                          </button>
                        )}
                        <a
                          href={`tel:${donor.phone}`}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          title="Call Donor"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>

    </div>
  );
};
