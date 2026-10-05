import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Building2,
    Droplet,
    ArrowLeft,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Plus,
    RefreshCw,
    Send,
    LogOut,
    Sparkles,
    AlertCircle,
    HeartHandshake,
    Phone,
    Calendar,
    Clock,
    Search,
    Check
} from 'lucide-react';
import { REGISTERED_HOSPITALS } from '../../data/mockData';
import { getHospitalDonorPledges, updatePledgeStatus } from '../../utils/hospitalDonorPledgeStore';
import type { HospitalDonorPledge } from '../../types';
import { hospitalApi } from '../../services/hospitalApi';

export const HospitalDashboard = () => {
    const { hospitalId } = useParams<{ hospitalId: string }>();
    const navigate = useNavigate();

    const [hospitalData, setHospitalData] = useState<any>(null);
    const [, setLoading] = useState(true);

    const mockHospital = REGISTERED_HOSPITALS.find((h) => h.id === hospitalId);
    const hospital = hospitalData || mockHospital;

    // Local state for interactive features
    const [stockState, setStockState] = useState<Record<string, number>>({
        'O-': 4, 'O+': 22, 'A+': 18, 'A-': 3, 'B+': 28, 'B-': 5, 'AB+': 12, 'AB-': 2
    });
    const [reqGroup, setReqGroup] = useState('O-');
    const [reqUnits, setReqUnits] = useState('3');
    const [reqUrgency, setReqUrgency] = useState('immediate');
    const [reqWard, setReqWard] = useState('OT-3 (Trauma Emergency)');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'inventory' | 'donors' | 'requisitions' | 'transfers' | 'radar'>('inventory');
    const [donorFilterStatus, setDonorFilterStatus] = useState<string>('all');
    const [donorFilterGroup, setDonorFilterGroup] = useState<string>('all');
    const [donorSearchQuery, setDonorSearchQuery] = useState<string>('');

    // Donor Pledges State (Scoped to current hospital)
    const [pledges, setPledges] = useState<HospitalDonorPledge[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!hospitalId) return;
            try {
                setLoading(true);
                const res: any = await hospitalApi.getDashboard(hospitalId);
                if (res?.hospital) {
                    setHospitalData({
                        ...res.hospital,
                        stock: res.stock || mockHospital?.stock || stockState,
                        bloodBankLinked: mockHospital?.bloodBankLinked || 'Ranchi Central Blood Bank'
                    });
                    if (res.stock) {
                        setStockState(res.stock);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch hospital dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [hospitalId]);

    useEffect(() => {
        if (!hospital?.id) return;
        const loadPledges = () => {
            setPledges(getHospitalDonorPledges(hospital.id));
        };
        loadPledges();

        const handlePledgeUpdate = () => {
            loadPledges();
        };
        window.addEventListener('hemovite_donor_pledges_updated', handlePledgeUpdate);
        window.addEventListener('storage', handlePledgeUpdate);

        return () => {
            window.removeEventListener('hemovite_donor_pledges_updated', handlePledgeUpdate);
            window.removeEventListener('storage', handlePledgeUpdate);
        };
    }, [hospital?.id]);

    // Donor Pledge Actions
    const handleMarkContacted = (pledge: HospitalDonorPledge) => {
        if (!hospital) return;
        updatePledgeStatus(pledge.id, 'Contacted', 'Coordinator contacted donor via phone. Donor confirmed willingness.');
        setPledges(getHospitalDonorPledges(hospital.id));
        triggerToast(`Donor ${pledge.donorName} (${pledge.bloodGroup}) marked as Contacted.`);
    };

    const handleScheduleDonation = (pledge: HospitalDonorPledge) => {
        if (!hospital) return;
        updatePledgeStatus(pledge.id, 'Scheduled', 'Appointment scheduled at hospital blood collection station.');
        setPledges(getHospitalDonorPledges(hospital.id));
        triggerToast(`Donation scheduled with ${pledge.donorName} (${pledge.bloodGroup}).`);
    };

    const handleMarkFulfilled = (pledge: HospitalDonorPledge) => {
        if (!hospital) return;
        updatePledgeStatus(pledge.id, 'Fulfilled', 'Blood successfully collected, screened, and placed in cold reserve.');
        // Replenish the on-site reserve / shortage metric for that blood group
        setStockState((prev) => ({
            ...prev,
            [pledge.bloodGroup]: (prev[pledge.bloodGroup] || 0) + 1,
        }));
        setPledges(getHospitalDonorPledges(hospital.id));
        triggerToast(`Donation fulfilled! +1 Unit added to ${pledge.bloodGroup} reserve (${(stockState[pledge.bloodGroup] || 0) + 1} Units total).`);
    };

    // Simulated transfer actions
    const [transfers, setTransfers] = useState([
        {
            id: 'TRF-8821',
            from: hospital?.bloodBankLinked || 'Ranchi Central Blood Bank',
            group: 'O-',
            units: 4,
            status: 'In Transit (Cold Chain Carrier)',
            eta: '14 Mins',
            critical: true,
        },
        {
            id: 'TRF-8819',
            from: 'Apex Regional Transfusion Unit',
            group: 'A+',
            units: 6,
            status: 'Dispatched',
            eta: '32 Mins',
            critical: false,
        },
    ]);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3800);
    };

    // INVALID HOSPITAL ID ERROR STATE
    if (!hospital) {
        return (
            <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
                <div className="bg-[#111827] border border-red-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500 text-brand-bright flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white">Hospital Not Found</h2>
                        <p className="text-sm text-slate-400">
                            Invalid hospital ID <strong className="text-red-400 font-mono">"{hospitalId}"</strong>.
                        </p>
                    </div>
                    <Link
                        to="/hospitals"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Registered Hospitals</span>
                    </Link>
                </div>
            </div>
        );
    }

    const handleBroadcastRequisition = (e: React.FormEvent) => {
        e.preventDefault();
        triggerToast(`Emergency requisition of ${reqUnits} Units of ${reqGroup} for ${reqWard} broadcasted to ${hospital.bloodBankLinked}!`);
        // Optimistic inventory update simulation
        setStockState((prev) => ({
            ...prev,
            [reqGroup]: Math.max(0, (prev[reqGroup] || 0) + Number(reqUnits)),
        }));
    };

    const totalStockUnits = Object.values(stockState).reduce((acc, curr) => acc + curr, 0);

    return (
        <div className="min-h-screen bg-[#0B1220] text-white flex flex-col selection:bg-brand-red selection:text-white relative">

            {/* TOAST ALERT */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* TOP DASHBOARD NAVIGATION */}
            <header className="bg-[#111827] border-b border-white/10 sticky top-0 z-40 shadow-xl backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">

                    {/* HOSPITAL BRAND & ID */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/hospitals"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Switch Hospital"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Hospitals</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-lg shadow-brand-red/30">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-lg font-black text-white leading-none">
                                        {hospital.name}
                                    </h1>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-600/50 text-red-300">
                                        {hospital.id}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Hospital Administrator Dashboard • {hospital.city}, {hospital.state}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TELEMETRY & LOGOUT ACTIONS */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>EHR Telemetry Live (HL7)</span>
                        </div>

                        <button
                            onClick={() => {
                                triggerToast('Session closed. Returning to hospital directory...');
                                setTimeout(() => navigate('/hospitals'), 600);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>

                </div>
            </header>

            {/* DASHBOARD BODY */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* TOP STATUS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* 1. Total Reserve */}
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Total Blood Units</span>
                            <Droplet className="w-4 h-4 text-brand-red" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                            {totalStockUnits} <span className="text-xs font-normal text-slate-400">Units</span>
                        </div>
                        <p className="text-[11px] text-emerald-400 font-medium">8 Wards & ICU Synchronized</p>
                    </div>

                    {/* 2. Critical Warning */}
                    <div className="bg-gradient-to-br from-red-950/60 to-[#111827] border border-red-500/30 rounded-2xl p-4 sm:p-5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-red-300">
                            <span>Active AI Shortage Alert</span>
                            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-brand-bright">
                            O− Critical (4 Days)
                        </div>
                        <p className="text-[11px] text-red-200">Requisition dispatched to central bank</p>
                    </div>

                    {/* 3. Linked Blood Bank */}
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Linked Supply Hub</span>
                            <Building2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-sm font-bold text-white truncate">
                            {hospital.bloodBankLinked}
                        </div>
                        <p className="text-[11px] text-slate-400">Direct 24/7 Buffer Line Active</p>
                    </div>

                    {/* 4. ICU & Bed Capacity */}
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Facility Capacity</span>
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-2xl font-black text-white">
                            {hospital.beds} <span className="text-xs font-normal text-slate-400">Beds</span>
                        </div>
                        <p className="text-[11px] text-purple-300 truncate">{hospital.icuCapacity}</p>
                    </div>

                </div>

                {/* SECTION TABS */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
                    {[
                        {
                            id: 'inventory',
                            label: <span>Ward Inventory Ledger</span>
                        },
                        {
                            id: 'donors',
                            label: (
                                <span className="flex items-center gap-2">
                                    <HeartHandshake className="w-4 h-4 text-brand-bright" />
                                    <span>Incoming Donor Pledges</span>
                                    {pledges.filter((p) => p.status === 'Pending Contact').length > 0 ? (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                                            {pledges.filter((p) => p.status === 'Pending Contact').length} New
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                                            {pledges.length}
                                        </span>
                                    )}
                                </span>
                            )
                        },
                        {
                            id: 'requisitions',
                            label: <span>Emergency Requisition Broadcast</span>
                        },
                        {
                            id: 'transfers',
                            label: <span>Inter-Facility Transfers (2 Active)</span>
                        },
                        {
                            id: 'radar',
                            label: <span>AI Shortage Radar</span>
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === tab.id
                                ? 'bg-brand-red text-white shadow-md'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 1. WARD INVENTORY LEDGER */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-lg font-black text-white">Live Ward Blood Inventory Matrix</h3>
                                    <p className="text-xs text-slate-400">
                                        Real-time stock across {hospital.name} blood storage units and trauma reserve fridges.
                                    </p>
                                </div>

                                <button
                                    onClick={() => triggerToast('Inventory data re-synchronized with hospital EHR system.')}
                                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                                    <span>Sync EHR Feed</span>
                                </button>
                            </div>

                            {/* 8 BLOOD GROUPS CARDS GRID */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {Object.keys(stockState).map((groupKey) => {
                                    const units = stockState[groupKey];
                                    const isCritical = units <= 4;
                                    const isModerate = units > 4 && units <= 15;

                                    return (
                                        <div
                                            key={groupKey}
                                            className={`p-4 rounded-2xl border transition-all ${isCritical
                                                ? 'bg-red-950/40 border-red-600/50'
                                                : isModerate
                                                    ? 'bg-amber-950/30 border-amber-600/40'
                                                    : 'bg-white/5 border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-white">{groupKey}</span>
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isCritical
                                                        ? 'bg-red-600 text-white'
                                                        : isModerate
                                                            ? 'bg-amber-600 text-white'
                                                            : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                                                        }`}
                                                >
                                                    {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'Optimal'}
                                                </span>
                                            </div>

                                            <div className="text-3xl font-black text-white mt-3 font-mono">
                                                {units} <span className="text-xs font-normal text-slate-400">Units</span>
                                            </div>

                                            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                                                <button
                                                    onClick={() => {
                                                        setStockState((prev) => ({
                                                            ...prev,
                                                            [groupKey]: Math.max(0, prev[groupKey] - 1),
                                                        }));
                                                        triggerToast(`Issued 1 Unit of ${groupKey} to ward.`);
                                                    }}
                                                    className="text-slate-400 hover:text-red-400 font-bold px-2 py-1 bg-white/5 rounded cursor-pointer"
                                                >
                                                    - Issue
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStockState((prev) => ({
                                                            ...prev,
                                                            [groupKey]: prev[groupKey] + 1,
                                                        }));
                                                        triggerToast(`Added 1 Unit of ${groupKey} to stock.`);
                                                    }}
                                                    className="text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 bg-white/5 rounded cursor-pointer"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                )}

                {/* 2. INCOMING DONOR PLEDGES / VOLUNTEER DONORS PANEL */}
                {activeTab === 'donors' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">

                            {/* HEADER & SUMMARY METRICS */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                                            <HeartHandshake className="w-5 h-5 text-brand-bright" />
                                            <span>Incoming Donor Pledges &amp; Volunteer Dispatch</span>
                                        </h3>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/50">
                                            Facility: {hospital.id}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Direct citizen donor offers pledged for <strong>{hospital.name}</strong> to resolve emergency shortages.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                                        Auto-Refreshed
                                    </span>
                                    <button
                                        onClick={() => {
                                            setPledges(getHospitalDonorPledges(hospital.id));
                                            triggerToast('Donor pledges reloaded from secure storage.');
                                        }}
                                        className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                                        <span>Refresh Offers</span>
                                    </button>
                                </div>
                            </div>

                            {/* 4 STAT SUMMARY CARDS */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                                {/* Total Pledges */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Total Pledged Offers
                                    </span>
                                    <div className="text-2xl font-black text-white font-mono">
                                        {pledges.length}
                                    </div>
                                    <p className="text-[10px] text-slate-400">Targeted for this hospital</p>
                                </div>

                                {/* Pending Contact */}
                                <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-4 space-y-1">
                                    <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider block">
                                        Pending Contact
                                    </span>
                                    <div className="text-2xl font-black text-brand-bright font-mono flex items-center gap-2">
                                        <span>{pledges.filter((p) => p.status === 'Pending Contact').length}</span>
                                        {pledges.filter((p) => p.status === 'Pending Contact').length > 0 && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse font-sans">
                                                Action Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-red-300/80">Awaiting coordinator call</p>
                                </div>

                                {/* Scheduled Appointments */}
                                <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-4 space-y-1">
                                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                                        Scheduled Donations
                                    </span>
                                    <div className="text-2xl font-black text-blue-400 font-mono">
                                        {pledges.filter((p) => p.status === 'Scheduled').length}
                                    </div>
                                    <p className="text-[10px] text-blue-300/80">Slot booked at station</p>
                                </div>

                                {/* Fulfilled / Collected */}
                                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
                                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                                        Fulfilled / Stocked
                                    </span>
                                    <div className="text-2xl font-black text-emerald-400 font-mono">
                                        {pledges.filter((p) => p.status === 'Fulfilled').length}
                                    </div>
                                    <p className="text-[10px] text-emerald-300/80">Units added to reserve</p>
                                </div>
                            </div>

                            {/* FILTER & SEARCH TOOLBAR */}
                            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={donorSearchQuery}
                                        onChange={(e) => setDonorSearchQuery(e.target.value)}
                                        placeholder="Search donor name, phone number, or notes..."
                                        className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-red"
                                    />
                                </div>

                                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                    {/* Status Filter */}
                                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                                        {[
                                            { id: 'all', label: 'All' },
                                            { id: 'pending contact', label: 'Pending' },
                                            { id: 'contacted', label: 'Contacted' },
                                            { id: 'scheduled', label: 'Scheduled' },
                                            { id: 'fulfilled', label: 'Fulfilled' }
                                        ].map((st) => (
                                            <button
                                                key={st.id}
                                                type="button"
                                                onClick={() => setDonorFilterStatus(st.id)}
                                                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${donorFilterStatus === st.id
                                                    ? 'bg-brand-red text-white'
                                                    : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {st.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Blood Group Filter */}
                                    <select
                                        value={donorFilterGroup}
                                        onChange={(e) => setDonorFilterGroup(e.target.value)}
                                        className="px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red"
                                    >
                                        <option value="all">All Groups</option>
                                        {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* PLEDGES TABLE */}
                            {pledges.filter((p) => {
                                const matchesStatus = donorFilterStatus === 'all' || p.status.toLowerCase() === donorFilterStatus;
                                const matchesGroup = donorFilterGroup === 'all' || p.bloodGroup === donorFilterGroup;
                                const query = donorSearchQuery.toLowerCase();
                                const matchesSearch = !donorSearchQuery ||
                                    p.donorName.toLowerCase().includes(query) ||
                                    p.phone.toLowerCase().includes(query) ||
                                    p.bloodGroup.toLowerCase().includes(query) ||
                                    (p.notes && p.notes.toLowerCase().includes(query));

                                return matchesStatus && matchesGroup && matchesSearch;
                            }).length === 0 ? (
                                <div className="py-12 text-center bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
                                        <HeartHandshake className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white">No Donor Pledges Found</h4>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                        {donorSearchQuery || donorFilterStatus !== 'all' || donorFilterGroup !== 'all'
                                            ? 'No donor pledges match your active filters. Try clearing your search or filters.'
                                            : 'No citizen pledges currently recorded for this hospital ID. Offers submitted on the Hospital Detail page will appear here in real-time.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                <th className="py-3 px-4">Donor &amp; ID</th>
                                                <th className="py-3 px-4">Blood Group</th>
                                                <th className="py-3 px-4">Phone Contact</th>
                                                <th className="py-3 px-4">Availability Slot</th>
                                                <th className="py-3 px-4">Pledged At</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4 text-right">Coordinator Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {pledges.filter((p) => {
                                                const matchesStatus = donorFilterStatus === 'all' || p.status.toLowerCase() === donorFilterStatus;
                                                const matchesGroup = donorFilterGroup === 'all' || p.bloodGroup === donorFilterGroup;
                                                const query = donorSearchQuery.toLowerCase();
                                                const matchesSearch = !donorSearchQuery ||
                                                    p.donorName.toLowerCase().includes(query) ||
                                                    p.phone.toLowerCase().includes(query) ||
                                                    p.bloodGroup.toLowerCase().includes(query) ||
                                                    (p.notes && p.notes.toLowerCase().includes(query));

                                                return matchesStatus && matchesGroup && matchesSearch;
                                            }).map((pledge) => {
                                                const isPending = pledge.status === 'Pending Contact';
                                                const isContacted = pledge.status === 'Contacted';
                                                const isScheduled = pledge.status === 'Scheduled';
                                                const isFulfilled = pledge.status === 'Fulfilled';

                                                return (
                                                    <tr
                                                        key={pledge.id}
                                                        className={`hover:bg-white/5 transition-colors ${isPending ? 'bg-red-950/15' : ''
                                                            }`}
                                                    >
                                                        {/* Donor & ID */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="space-y-0.5">
                                                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                                                    <span>{pledge.donorName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                                    <span className="font-mono text-slate-400">{pledge.id}</span>
                                                                    <span>•</span>
                                                                    <span>{pledge.age} yrs, {pledge.gender}</span>
                                                                </div>
                                                                {pledge.notes && (
                                                                    <p className="text-[10px] text-slate-400 italic max-w-xs truncate" title={pledge.notes}>
                                                                        "{pledge.notes}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Blood Group */}
                                                        <td className="py-3.5 px-4">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-br from-brand-red to-brand-deep text-white font-mono font-black text-xs shadow-sm">
                                                                <Droplet className="w-3 h-3 fill-current" />
                                                                <span>{pledge.bloodGroup}</span>
                                                            </span>
                                                        </td>

                                                        {/* Phone */}
                                                        <td className="py-3.5 px-4">
                                                            <a
                                                                href={`tel:${pledge.phone}`}
                                                                className="inline-flex items-center gap-1 text-slate-200 hover:text-brand-bright font-mono font-bold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                                                            >
                                                                <Phone className="w-3 h-3 text-emerald-400" />
                                                                <span>{pledge.phone}</span>
                                                            </a>
                                                        </td>

                                                        {/* Availability Slot */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="inline-flex items-center gap-1 text-slate-300 font-medium bg-white/5 px-2.5 py-1 rounded-lg">
                                                                <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                                                                <span>{pledge.preferredSlot}</span>
                                                            </div>
                                                        </td>

                                                        {/* Pledged At */}
                                                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                                                            {pledge.timestamp}
                                                        </td>

                                                        {/* Status */}
                                                        <td className="py-3.5 px-4">
                                                            {isPending && (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/50">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                                    <span>Pending Contact</span>
                                                                </span>
                                                            )}
                                                            {isContacted && (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                                    <span>Contacted</span>
                                                                </span>
                                                            )}
                                                            {isScheduled && (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                                                                    <Calendar className="w-3 h-3 text-purple-400" />
                                                                    <span>Scheduled</span>
                                                                </span>
                                                            )}
                                                            {isFulfilled && (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                                    <span>Fulfilled (+1 Stock)</span>
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Action Buttons */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                                {isPending && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMarkContacted(pledge)}
                                                                            className="px-2.5 py-1 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                                            title="Mark donor as contacted"
                                                                        >
                                                                            <Phone className="w-3 h-3" />
                                                                            <span>Mark Contacted</span>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleScheduleDonation(pledge)}
                                                                            className="px-2.5 py-1 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                                            title="Schedule donation appointment"
                                                                        >
                                                                            <Calendar className="w-3 h-3" />
                                                                            <span>Schedule</span>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMarkFulfilled(pledge)}
                                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                                            title="Mark blood collected and increment reserve stock"
                                                                        >
                                                                            <Check className="w-3 h-3" />
                                                                            <span>Fulfilled</span>
                                                                        </button>
                                                                    </>
                                                                )}

                                                                {isContacted && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleScheduleDonation(pledge)}
                                                                            className="px-2.5 py-1 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                                            title="Schedule donation appointment"
                                                                        >
                                                                            <Calendar className="w-3 h-3" />
                                                                            <span>Schedule</span>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMarkFulfilled(pledge)}
                                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                                                            title="Mark blood collected and increment reserve stock"
                                                                        >
                                                                            <Check className="w-3 h-3" />
                                                                            <span>Fulfilled</span>
                                                                        </button>
                                                                    </>
                                                                )}

                                                                {isScheduled && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleMarkFulfilled(pledge)}
                                                                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                                                                        title="Complete blood collection and add 1 unit to hospital inventory"
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                        <span>Complete &amp; Add Unit</span>
                                                                    </button>
                                                                )}

                                                                {isFulfilled && (
                                                                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                                                        <Check className="w-3 h-3" />
                                                                        <span>Added to {pledge.bloodGroup} Reserve</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* 2. EMERGENCY REQUISITION BROADCAST */}
                {activeTab === 'requisitions' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">

                            <div className="border-b border-white/10 pb-4">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-brand-red" />
                                    <span>Create Direct Emergency Requisition / Inter-Facility Broadcast</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Requisitions are automatically routed to {hospital.bloodBankLinked} and nearby verified blood banks.
                                </p>
                            </div>

                            <form onSubmit={handleBroadcastRequisition} className="space-y-5">

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Blood Group */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300">Blood Group *</label>
                                        <select
                                            value={reqGroup}
                                            onChange={(e) => setReqGroup(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white font-bold"
                                        >
                                            {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map((g) => (
                                                <option key={g} value={g}>{g} Blood</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Units */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300">Units Required (Units) *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            required
                                            value={reqUnits}
                                            onChange={(e) => setReqUnits(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                                        />
                                    </div>

                                    {/* Urgency */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300">Urgency Level *</label>
                                        <select
                                            value={reqUrgency}
                                            onChange={(e) => setReqUrgency(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                                        >
                                            <option value="immediate">Immediate (&lt; 1 Hour / OT Emergency)</option>
                                            <option value="2hours">Within 2–4 Hours</option>
                                            <option value="today">Scheduled Surgery</option>
                                        </select>
                                    </div>

                                    {/* Target Ward */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300">Target Ward / OT *</label>
                                        <input
                                            type="text"
                                            required
                                            value={reqWard}
                                            onChange={(e) => setReqWard(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-xs sm:text-sm text-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Broadcast Requisition to {hospital.bloodBankLinked}</span>
                                </button>

                            </form>

                        </div>
                    </div>
                )}

                {/* 3. INTER-FACILITY TRANSFERS */}
                {activeTab === 'transfers' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">

                            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-white">Active Inter-Facility Buffer Transfers</h3>
                                    <p className="text-xs text-slate-400">
                                        Real-time cold-chain tracking for incoming hospital blood supply dispatches.
                                    </p>
                                </div>

                                <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                                    GPS Transit Live
                                </span>
                            </div>

                            <div className="space-y-3">
                                {transfers.map((trf) => (
                                    <div
                                        key={trf.id}
                                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-blue-400">{trf.id}</span>
                                                <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-xs rounded">
                                                    {trf.group} • {trf.units} Units
                                                </span>
                                                {trf.critical && (
                                                    <span className="text-[10px] bg-red-950 text-red-400 border border-red-700 px-2 py-0.5 rounded font-bold">
                                                        Emergency Buffer
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-300">
                                                Dispatch Source: <strong className="text-white">{trf.from}</strong>
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                Status: <span className="text-emerald-400 font-semibold">{trf.status}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-[10px] text-slate-400 uppercase">Estimated Arrival</div>
                                                <div className="text-base font-black text-amber-400">{trf.eta}</div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    triggerToast(`Transfer ${trf.id} received and checked into ${hospital.name} cold-storage.`);
                                                    setTransfers((prev) => prev.filter((t) => t.id !== trf.id));
                                                }}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                                            >
                                                Confirm Receipt
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}

                {/* 4. AI SHORTAGE RADAR */}
                {activeTab === 'radar' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">

                            <div className="border-b border-white/10 pb-4">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-brand-bright" />
                                    <span>AI Shortage Radar for {hospital.name}</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Predictive ML model (XGBoost v3.2) calculating next 7-day shortage probability for this facility.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-950/40 border border-red-600/40 rounded-2xl p-4 space-y-2">
                                    <div className="text-xs text-red-300 font-bold uppercase">High Risk Deficit</div>
                                    <div className="text-2xl font-black text-brand-bright">O− Blood (82% Risk)</div>
                                    <p className="text-xs text-slate-300">
                                        Depletion estimated in <strong className="text-white">4 Days</strong> under current surgical demand velocity.
                                    </p>
                                </div>

                                <div className="bg-amber-950/40 border border-amber-600/40 rounded-2xl p-4 space-y-2">
                                    <div className="text-xs text-amber-300 font-bold uppercase">Moderate Monitoring</div>
                                    <div className="text-2xl font-black text-amber-400">A− Blood (68% Risk)</div>
                                    <p className="text-xs text-slate-300">
                                        Expected supply boundary breach in <strong className="text-white">6 Days</strong>.
                                    </p>
                                </div>

                                <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-4 space-y-2">
                                    <div className="text-xs text-emerald-300 font-bold uppercase">Stable Reserve</div>
                                    <div className="text-2xl font-black text-emerald-400">B+ Blood (19% Risk)</div>
                                    <p className="text-xs text-slate-300">
                                        Surplus available (95 Units) for secondary hospital network sharing.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </main>

            {/* FOOTER */}
            <footer className="bg-[#111827] border-t border-white/10 py-6 text-center text-xs text-slate-500">
                Logged in as Administrator • {hospital.name} ({hospital.id}) • HemoVite Hospital Command Grid
            </footer>

        </div>
    );
};
