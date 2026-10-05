import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Sparkles, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { REGISTERED_BLOOD_BANKS, MOCK_BLOOD_REQUESTS } from '../../data/mockData';
import { BloodBankNav } from '../../components/bloodbank/BloodBankNav';
import type { HospitalBloodRequest, BloodBank } from '../../types';
import { FindMatchingBloodModal } from '../../components/bloodbank/FindMatchingBloodModal';
import { bloodBankApi } from '../../services/bloodBankApi';

export const BloodBankRequests = () => {
  const { bloodBankId } = useParams<{ bloodBankId: string }>();
  const [bloodBank, setBloodBank] = useState<BloodBank | null>(null);
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<HospitalBloodRequest[]>(MOCK_BLOOD_REQUESTS);
  const [stockState, setStockState] = useState<Record<string, number>>({
    'O-': 9, 'O+': 61, 'A+': 42, 'A-': 12, 'B+': 38, 'B-': 7, 'AB+': 21, 'AB-': 4
  });

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
          if (data.inventory) setStockState(data.inventory);
        } else {
          const mock = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId || b.registrationNumber === bloodBankId);
          if (mock) {
            setBloodBank(mock);
            if (mock.inventory) setStockState(mock.inventory);
          }
        }
      } catch (err) {
        const mock = REGISTERED_BLOOD_BANKS.find((b) => b.id === bloodBankId || b.registrationNumber === bloodBankId);
        if (mock && isMounted) {
          setBloodBank(mock);
          if (mock.inventory) setStockState(mock.inventory);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBank();
    return () => { isMounted = false; };
  }, [bloodBankId]);

  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'emergency' | 'urgent' | 'normal'>('all');
  const [matchingModalOpen, setMatchingModalOpen] = useState(false);
  const [matchingGroup, setMatchingGroup] = useState('O-');
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
          <h2 className="text-xl font-bold text-white">Loading Requisitions...</h2>
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

  const handleApproveRequest = (req: HospitalBloodRequest) => {
    const available = stockState[req.bloodGroup] || 0;
    if (available < req.unitsRequired) {
      setMatchingGroup(req.bloodGroup);
      setMatchingModalOpen(true);
      triggerToast(`⚠️ Insufficient Stock: Only ${available} Units of ${req.bloodGroup} available for ${req.unitsRequired} Units needed. Opening inter-facility transfer matching...`);
      return;
    }

    // Deduct stock
    setStockState((prev) => ({
      ...prev,
      [req.bloodGroup]: Math.max(0, (prev[req.bloodGroup] || 0) - req.unitsRequired),
    }));

    // Update status
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Approved' } : r))
    );

    triggerToast(`Approved request ${req.id}: Reserved & Packaged ${req.unitsRequired} Units of ${req.bloodGroup} for ${req.hospitalName}!`);
  };

  const handleRejectRequest = (reqId: string, hospitalName: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Rejected' } : r))
    );
    triggerToast(`Requisition ${reqId} from ${hospitalName} marked as Rejected.`);
  };

  const filteredRequests = requests.filter((r) => {
    if (urgencyFilter === 'all') return true;
    return r.urgency === urgencyFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white pb-16">
      
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <BloodBankNav bloodBank={bloodBank} activeTab="requests" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Inbox className="w-6 h-6 text-brand-red" />
              <span>Hospital Blood Requisition Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live inbound clinical blood requisitions from verified hospital ICUs and emergency trauma wards.
            </p>
          </div>

          <button
            onClick={() => {
              setMatchingGroup('O-');
              setMatchingModalOpen(true);
            }}
            className="px-5 py-3 rounded-xl bg-brand-red/20 hover:bg-brand-red/30 border border-brand-red/40 text-brand-bright font-bold text-xs shadow flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find Alternative Network Stock</span>
          </button>
        </div>

        {/* URGENCY FILTER TABS */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Urgency Triage:</span>
            {[
              { id: 'all', label: `All Requests (${requests.length})` },
              { id: 'emergency', label: '🔴 Immediate Emergency (< 1h)' },
              { id: 'urgent', label: '🟠 Urgent (2-4 Hours)' },
              { id: 'normal', label: '🟡 Scheduled / Routine' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setUrgencyFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  urgencyFilter === tab.id
                    ? 'bg-brand-red text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Auto-Reserve Engine: <strong className="text-emerald-400">ACTIVE</strong>
          </div>
        </div>

        {/* REQUEST CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRequests.map((req) => {
            const isEmergency = req.urgency === 'emergency';
            const isUrgent = req.urgency === 'urgent';
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';

            const available = stockState[req.bloodGroup] || 0;
            const hasEnoughStock = available >= req.unitsRequired;

            return (
              <div
                key={req.id}
                className={`rounded-3xl p-6 border transition-all space-y-4 relative overflow-hidden ${
                  isEmergency
                    ? 'bg-gradient-to-br from-red-950/60 to-[#111827] border-red-500/50 shadow-xl'
                    : isUrgent
                    ? 'bg-[#111827] border-amber-500/40 shadow-lg'
                    : 'bg-[#111827] border-white/10'
                }`}
              >
                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-red text-white font-black text-xl flex items-center justify-center shadow-lg shadow-brand-red/30 shrink-0">
                      {req.bloodGroup}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">{req.hospitalName}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-slate-300 border border-white/10">
                          {req.hospitalId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 font-medium">{req.targetWard}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isEmergency
                          ? 'bg-red-600 text-white border-red-500 animate-pulse'
                          : isUrgent
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-blue-600 text-white border-blue-500'
                      }`}
                    >
                      {req.urgency.toUpperCase()}
                    </span>
                    <div className="text-sm font-mono font-black text-white mt-1">
                      {req.unitsRequired} Units
                    </div>
                  </div>
                </div>

                {/* DETAILS BOX */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Clinical Case:</span>
                    <strong className="text-white">{req.patientDetails}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-white/5">
                    <span>Required By: <strong className="text-amber-300">{req.requiredBy}</strong></span>
                    <span>Requested: {req.requestedTime}</span>
                  </div>

                  {/* Stock Availability Indicator */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                    <span className="text-slate-400">Current Blood Bank Stock:</span>
                    <span
                      className={`font-bold font-mono ${
                        hasEnoughStock ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {available} Units Available {hasEnoughStock ? '(Sufficient)' : '(Insufficient Stock)'}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-1 flex items-center justify-between gap-3">
                  {isApproved ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-4 py-2.5 rounded-xl border border-emerald-500/40 w-full justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Units Reserved & Dispatched to {req.hospitalName}</span>
                    </div>
                  ) : isRejected ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/60 px-4 py-2.5 rounded-xl border border-red-500/40 w-full justify-center">
                      <XCircle className="w-4 h-4" />
                      <span>Requisition Rejected</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all ${
                          hasEnoughStock
                            ? 'bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800'
                            : 'bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{hasEnoughStock ? 'Approve & Reserve Stock' : 'Resolve via Network Transfer'}</span>
                      </button>

                      <button
                        onClick={() => handleRejectRequest(req.id, req.hospitalName)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-bold transition-all"
                      >
                        Reject
                      </button>

                      <a
                        href={`tel:${req.contactPhone}`}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                        title="Call Hospital Emergency Coordinator"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <FindMatchingBloodModal
        isOpen={matchingModalOpen}
        onClose={() => setMatchingModalOpen(false)}
        currentBloodBankId={bloodBank.id}
        initialGroup={matchingGroup}
      />

    </div>
  );
};
