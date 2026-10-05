import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS, MOCK_DONATIONS } from '../../data/mockData';
import { BloodBankNav } from '../../components/bloodbank/BloodBankNav';
import type { BloodDonation, BloodBank } from '../../types';
import { RecordDonationModal } from '../../components/bloodbank/RecordDonationModal';
import { bloodBankApi } from '../../services/bloodBankApi';

export const BloodBankDonations = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();
  const [bloodBank, setBloodBank] = useState<BloodBank | null>(null);
  const [loading, setLoading] = useState(true);

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
        } else {
          const mock = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId || b.registrationNumber === bloodBankId);
          if (mock) setBloodBank(mock);
        }
      } catch (err) {
        const mock = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId || b.registrationNumber === bloodBankId);
        if (mock && isMounted) setBloodBank(mock);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBank();
    return () => { isMounted = false; };
  }, [bloodBankId]);

  const [donations, setDonations] = useState<BloodDonation[]>(MOCK_DONATIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <Loader2 className="w-10 h-10 text-brand-red animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Loading Donation Ledger...</h2>
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

  const handleAddDonation = (donation: BloodDonation) => {
    setDonations((prev) => [donation, ...prev]);
    triggerToast(`Recorded new blood collection from ${donation.donorName} (${donation.bloodGroup})!`);
  };

  const handleStatusChange = (id: string, newStatus: BloodDonation['status']) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    triggerToast(`Donation ${id} status moved to ${newStatus}.`);
  };

  const filteredDonations = donations.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.donorName.toLowerCase().includes(q) ||
      d.donorId.toLowerCase().includes(q) ||
      d.bloodGroup.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white pb-16">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BloodBankNav bloodBank={bloodBank} activeTab="donations" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <HeartHandshake className="w-6 h-6 text-emerald-400" />
              <span>Blood Donation Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Track volunteer donor intake, component testing, ELISA screening, and storage pipelines for {bloodBank.name}.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record New Donation</span>
          </button>
        </div>

        {/* DONATION METRICS CARDS (Requirement 12) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Today's Collections</span>
            <div className="text-3xl font-black text-white font-mono">36 <span className="text-xs font-normal text-slate-400">Units</span></div>
            <p className="text-[11px] text-emerald-400">4 Rare blood group donations</p>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Weekly Camp Intake</span>
            <div className="text-3xl font-black text-white font-mono">214 <span className="text-xs font-normal text-slate-400">Units</span></div>
            <p className="text-[11px] text-blue-400">3 Mobile vans active in district</p>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Monthly Donor Total</span>
            <div className="text-3xl font-black text-white font-mono">890 <span className="text-xs font-normal text-slate-400">Units</span></div>
            <p className="text-[11px] text-emerald-400">100% voluntary non-remunerated</p>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor name, donor ID, blood group..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Pipeline Stage:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs font-bold text-white"
              >
                <option value="all">All Statuses ({donations.length})</option>
                <option value="Collected">Collected</option>
                <option value="Tested">Tested</option>
                <option value="Approved">Approved</option>
                <option value="Stored">Stored</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/5">
                  <th className="py-3.5 px-4 rounded-l-xl">Donor Details</th>
                  <th className="py-3.5 px-4">Donor ID</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Units</th>
                  <th className="py-3.5 px-4">Donation Date</th>
                  <th className="py-3.5 px-4">Screening / Hb</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 rounded-r-xl text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-bold text-white text-base">{d.donorName}</span>
                        <span className="text-[11px] text-slate-400 block">{d.notes}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-blue-400 text-xs">
                      {d.donorId}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg font-black text-xs bg-red-950 text-red-300 border border-red-600/50">
                        {d.bloodGroup}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-white">
                      {d.units} Unit
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-300">
                      {d.donationDate}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-300">
                      <div className="font-medium">{d.screeningStatus}</div>
                      {d.hemoglobin && (
                        <span className="text-[10px] text-emerald-400 font-mono">Hb: {d.hemoglobin}</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          d.status === 'Stored'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : d.status === 'Approved'
                            ? 'bg-teal-950 text-teal-300 border border-teal-500/40'
                            : d.status === 'Tested'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : d.status === 'Rejected'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{d.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.id, e.target.value as any)}
                        className="px-2 py-1 bg-slate-900 border border-white/20 rounded-lg text-xs font-semibold text-slate-200"
                      >
                        <option value="Collected">Collected</option>
                        <option value="Tested">Tested</option>
                        <option value="Approved">Approved</option>
                        <option value="Stored">Stored</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      <RecordDonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRecord={handleAddDonation}
      />

    </div>
  );
};
