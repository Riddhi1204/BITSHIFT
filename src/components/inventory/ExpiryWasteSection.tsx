import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Activity,
  BarChart3,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Search,
  RefreshCw,
  Calendar,
  Layers,
  Building2,
  MapPin,
  Loader2,
  AlertOctagon,
  Eye,
} from 'lucide-react';
import {
  inventoryApi,
  type ExpiryBatchItem,
  type ExpirySummary,
  type WasteAnalyticsData,
  type WastePreventionInsight,
  type ExpiryAlertItem,
} from '../../services/inventoryApi';
import { RecordWasteModal } from '../modals/RecordWasteModal';

interface ExpiryWasteSectionProps {
  role?: 'blood_bank' | 'government' | 'ngo' | 'hospital';
  bloodBankId?: string;
  hospitalId?: string;
  title?: string;
  subtitle?: string;
  onRefreshParent?: () => void;
}

export const ExpiryWasteSection = ({
  role = 'blood_bank',
  bloodBankId,
  hospitalId,
  title = 'Expiry & Waste Management',
  subtitle = 'Real-time cold-chain expiry tracking, regulatory waste records, and shelf-life analytics',
  onRefreshParent,
}: ExpiryWasteSectionProps) => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<ExpiryBatchItem[]>([]);
  const [summary, setSummary] = useState<ExpirySummary | null>(null);
  const [analytics, setAnalytics] = useState<WasteAnalyticsData | null>(null);
  const [insights, setInsights] = useState<WastePreventionInsight[]>([]);
  const [alerts, setAlerts] = useState<ExpiryAlertItem[]>([]);

  // Filters
  const [warningDays, setWarningDays] = useState<number>(7);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'batches' | 'analytics' | 'insights' | 'alerts'>('batches');

  // Modals & Interactivity
  const [wasteModalOpen, setWasteModalOpen] = useState(false);
  const [selectedBatchForWaste, setSelectedBatchForWaste] = useState<ExpiryBatchItem | null>(null);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<ExpiryBatchItem | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [updatingBatchId, setUpdatingBatchId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3800);
  };

  // Load complete data
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [expiryRes, analyticsRes, insightsRes, alertsRes] = await Promise.all([
        inventoryApi.getExpiry({
          bloodBankId: role === 'blood_bank' ? bloodBankId : undefined,
          hospitalId: role === 'hospital' ? hospitalId : undefined,
          warningDays,
          bloodGroup: bloodGroupFilter,
          status: statusFilter,
          search: searchQuery,
          state: stateFilter !== 'all' ? stateFilter : undefined,
        }),
        inventoryApi.getWasteAnalytics({
          bloodBankId: role === 'blood_bank' ? bloodBankId : undefined,
          hospitalId: role === 'hospital' ? hospitalId : undefined,
          bloodGroup: bloodGroupFilter,
          state: stateFilter !== 'all' ? stateFilter : undefined,
        }),
        inventoryApi.getWastePreventionInsights({
          bloodBankId: role === 'blood_bank' ? bloodBankId : undefined,
          hospitalId: role === 'hospital' ? hospitalId : undefined,
        }),
        inventoryApi.getExpiryAlerts({
          bloodBankId: role === 'blood_bank' ? bloodBankId : undefined,
          hospitalId: role === 'hospital' ? hospitalId : undefined,
        }),
      ]);

      setBatches(expiryRes.batches || []);
      setSummary(expiryRes.summary || null);
      setAnalytics(analyticsRes || null);
      setInsights(insightsRes || []);
      setAlerts(alertsRes || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load expiry information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bloodBankId, hospitalId, warningDays, statusFilter, bloodGroupFilter, stateFilter]);

  // Handle Mark as Used
  const handleMarkAsUsed = async (batch: ExpiryBatchItem) => {
    if (batch.calculatedStatus === 'EXPIRED') {
      showToast('Cannot issue expired blood for clinical use.');
      return;
    }
    if (batch.calculatedStatus === 'WASTED') {
      showToast('Cannot issue previously discarded blood.');
      return;
    }

    setUpdatingBatchId(batch.id);
    try {
      await inventoryApi.updateBatchStatus(batch.id, 'used', 'Clinical transfusion issue');
      showToast(`Batch ${batch.batchNumber} (${batch.bloodGroup}, ${batch.units} Units) marked as Used.`);
      await loadData();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setUpdatingBatchId(null);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'SAFE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            🟢 Safe
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            🟡 Expiring Soon
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/90 border border-red-500 text-red-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            🔴 Expired
          </span>
        );
      case 'WASTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            ⚫ Wasted
          </span>
        );
      case 'USED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            🔵 Used
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  const filteredBatches = useMemo(() => {
    if (!searchQuery.trim()) return batches;
    const q = searchQuery.toLowerCase();
    return batches.filter(
      (b) =>
        b.batchNumber.toLowerCase().includes(q) ||
        b.bloodGroup.toLowerCase().includes(q) ||
        b.component.toLowerCase().includes(q) ||
        b.organizationName.toLowerCase().includes(q)
    );
  }, [batches, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* FLOATING ACTION TOAST */}
      {actionSuccessMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-slate-900 border border-white/20 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white shadow-lg shadow-red-900/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{title}</span>
                {role === 'government' && (
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700/50">
                    National Grid Aggregator
                  </span>
                )}
                {role === 'ngo' && (
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                    Voluntary Drive Coordinator
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* TOP BUTTONS */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => loadData()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-bright' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          {role !== 'government' && (
            <button
              onClick={() => {
                setSelectedBatchForWaste(null);
                setWasteModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Record Discard / Waste</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* TOTAL INVENTORY */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Total Tracked Units</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {summary?.totalUnits ?? 0} <span className="text-xs font-normal text-slate-400">Units</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <Activity className="w-3 h-3" /> {summary?.safeUnits ?? 0} Safe Units
          </p>
        </div>

        {/* EXPIRING SOON */}
        <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span className="font-bold uppercase tracking-wider text-[11px]">Expiring Soon ({warningDays}d)</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            {summary?.expiringSoonUnits ?? 0} <span className="text-xs font-normal text-amber-400/80">Units</span>
          </div>
          <p className="text-[11px] text-amber-300/90 font-semibold flex items-center gap-1">
            ⚠ {summary?.expiringTodayUnits ?? 0} expiring today
          </p>
        </div>

        {/* EXPIRED UNITS */}
        <div className="bg-gradient-to-br from-red-950/60 to-[#111827] border border-red-500/40 rounded-2xl p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-red-300">
            <span className="font-bold uppercase tracking-wider text-[11px]">Expired Units</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
            {summary?.expiredUnits ?? 0} <span className="text-xs font-normal text-red-300">Units</span>
          </div>
          <p className="text-[11px] text-red-300 font-semibold">
            {summary?.expiredUnits && summary.expiredUnits > 0 ? '⚠ Action Required: Discard' : 'No overdue batches'}
          </p>
        </div>

        {/* WASTED UNITS */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Wasted / Discarded</span>
            <Trash2 className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-300 font-mono">
            {summary?.wastedUnits ?? analytics?.totalWastedUnits ?? 0} <span className="text-xs font-normal text-slate-400">Units</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-semibold">Regulatory audit trail logged</p>
        </div>

        {/* WASTE RATE % */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-1.5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[11px]">Waste Rate</span>
            <BarChart3 className="w-4 h-4 text-brand-bright" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {analytics?.wasteRate ?? summary?.wasteRate ?? 0}%
          </div>
          <div className="text-[11px] font-semibold">
            {analytics?.historicalComparison?.hasEnoughData ? (
              <span className={`flex items-center gap-1 ${analytics.historicalComparison.trend === 'decrease' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {analytics.historicalComparison.trend === 'decrease' ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                {analytics.historicalComparison.message}
              </span>
            ) : (
              <span className="text-slate-400">Not enough historical data</span>
            )}
          </div>
        </div>

      </div>

      {/* 2. SUB-SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto custom-scrollbar">
        {[
          { id: 'batches', label: 'Inventory Batches & Expiry', count: batches.length, icon: Layers },
          { id: 'analytics', label: 'Waste Analytics & Trends', icon: BarChart3 },
          { id: 'insights', label: 'Waste Prevention Insights', count: insights.length, icon: Sparkles },
          { id: 'alerts', label: 'Expiry Alerts', count: alerts.length, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-brand-red text-white shadow-lg shadow-red-900/40'
                  : 'bg-[#111827] text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/40 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BATCHES & EXPIRY TABLE */}
      {activeTab === 'batches' && (
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
          
          {/* FILTER TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search batch number, blood group, component, facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0B1220] border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Configurable Warning Days Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Warning Window:</span>
              </span>
              <div className="flex items-center bg-[#0B1220] p-1 rounded-xl border border-white/10 text-xs font-bold">
                {[
                  { days: 0, label: 'Today' },
                  { days: 3, label: '3 Days' },
                  { days: 7, label: '7 Days (Default)' },
                  { days: 30, label: '30 Days' },
                ].map((w) => (
                  <button
                    key={w.days}
                    onClick={() => setWarningDays(w.days)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      warningDays === w.days
                        ? 'bg-brand-red text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Group Filter */}
            <div className="flex items-center gap-2">
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="px-3 py-2 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Blood Groups</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="safe">🟢 Safe Only</option>
                <option value="expiring_soon">🟡 Expiring Soon</option>
                <option value="expired">🔴 Expired</option>
                <option value="wasted">⚫ Wasted</option>
                <option value="used">🔵 Used</option>
              </select>

              {/* State Filter (Government view) */}
              {role === 'government' && (
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0B1220] border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="all">All States</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              )}
            </div>

          </div>

          {/* TABLE */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Loading expiry data from PostgreSQL database...</p>
              <p className="text-xs text-slate-400">Computing real-time shelf life and safety windows</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-3 bg-red-950/30 border border-red-500/30 rounded-2xl p-6">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-sm font-bold text-white">{error}</p>
              <button
                onClick={() => loadData()}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-slate-400 bg-white/5 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">No blood units matching filter criteria</h4>
              <p className="text-xs">No blood units are currently approaching expiry or matching the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Blood Group</th>
                    <th className="py-3 px-3">Component</th>
                    <th className="py-3 px-3">Batch Number</th>
                    {role === 'government' && <th className="py-3 px-3">Organization</th>}
                    <th className="py-3 px-3 text-center">Units</th>
                    <th className="py-3 px-3">Collection Date</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3 text-center">Days Left</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBatches.map((batch) => {
                    const isExpired = batch.calculatedStatus === 'EXPIRED';
                    const isWasted = batch.calculatedStatus === 'WASTED';
                    const isUsed = batch.calculatedStatus === 'USED';
                    const isUpdating = updatingBatchId === batch.id;

                    return (
                      <tr
                        key={batch.id}
                        className={`hover:bg-white/5 transition-colors ${
                          isExpired ? 'bg-red-950/20' : ''
                        }`}
                      >
                        {/* Blood Group */}
                        <td className="py-3.5 px-3">
                          <span className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 text-brand-bright font-black flex items-center justify-center text-xs shadow-inner">
                            {batch.bloodGroup}
                          </span>
                        </td>

                        {/* Component */}
                        <td className="py-3.5 px-3 font-semibold text-slate-200">
                          {batch.component}
                        </td>

                        {/* Batch Number */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                          {batch.batchNumber}
                        </td>

                        {/* Organization (Government / Aggregated view) */}
                        {role === 'government' && (
                          <td className="py-3.5 px-3 text-[11px]">
                            <div className="font-bold text-white truncate max-w-[160px]">
                              {batch.organizationName}
                            </div>
                            <div className="text-slate-400 text-[10px]">{batch.location}</div>
                          </td>
                        )}

                        {/* Units */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-sm text-white">
                          {batch.units}
                        </td>

                        {/* Collection Date */}
                        <td className="py-3.5 px-3 text-slate-400">
                          {batch.collectionDate
                            ? new Date(batch.collectionDate).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        {/* Expiry Date */}
                        <td className="py-3.5 px-3 font-semibold text-slate-200">
                          {new Date(batch.expiryDate).toLocaleDateString()}
                        </td>

                        {/* Days Remaining */}
                        <td className="py-3.5 px-3 text-center font-mono">
                          {isWasted || isUsed ? (
                            <span className="text-slate-500">—</span>
                          ) : batch.daysRemaining < 0 ? (
                            <span className="text-red-400 font-black">
                              {Math.abs(batch.daysRemaining)}d ago
                            </span>
                          ) : batch.daysRemaining === 0 ? (
                            <span className="text-amber-400 font-black animate-pulse">Today</span>
                          ) : (
                            <span
                              className={`font-bold ${
                                batch.daysRemaining <= 3
                                  ? 'text-amber-300'
                                  : batch.daysRemaining <= 7
                                  ? 'text-amber-400/80'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {batch.daysRemaining} days
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          {renderStatusBadge(batch.calculatedStatus)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* View Details */}
                            <button
                              onClick={() => setSelectedBatchDetails(batch)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              title="View Batch Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Mark as Used (Only for non-expired, non-wasted, non-government view) */}
                            {role !== 'government' && (
                              <button
                                onClick={() => handleMarkAsUsed(batch)}
                                disabled={isExpired || isWasted || isUsed || isUpdating}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  isExpired || isWasted || isUsed
                                    ? 'opacity-30 cursor-not-allowed bg-white/5 text-slate-500'
                                    : 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
                                }`}
                                title={
                                  isExpired
                                    ? 'Cannot issue expired blood'
                                    : isWasted
                                    ? 'Cannot issue discarded blood'
                                    : 'Mark as Issued / Transfused'
                                }
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  'Mark Used'
                                )}
                              </button>
                            )}

                            {/* Mark as Wasted */}
                            {role !== 'government' && (
                              <button
                                onClick={() => {
                                  setSelectedBatchForWaste(batch);
                                  setWasteModalOpen(true);
                                }}
                                disabled={isWasted || isUsed}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  isWasted || isUsed
                                    ? 'opacity-30 cursor-not-allowed bg-white/5 text-slate-500'
                                    : 'bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30'
                                }`}
                                title="Record Waste / Discard"
                              >
                                Discard
                              </button>
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
      )}

      {/* TAB 2: WASTE ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Waste by Blood Group */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-bright" />
                  <h4 className="text-sm font-black text-white">Waste by Blood Group</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live Audit Count</span>
              </div>

              <div className="space-y-2.5">
                {Object.entries(analytics.wasteByGroup).map(([group, units]) => {
                  const maxUnits = Math.max(1, ...Object.values(analytics.wasteByGroup));
                  const pct = Math.round((units / (analytics.totalWastedUnits || 1)) * 100);
                  const barWidth = Math.round((units / maxUnits) * 100);

                  return (
                    <div key={group} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white font-mono">{group}</span>
                        <span className="text-slate-400 font-mono">
                          {units} Units <span className="text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Waste by Reason */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-black text-white">Waste by Reason</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Quality Breakdown</span>
              </div>

              <div className="space-y-2.5">
                {Object.keys(analytics.wasteByReason).length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No waste records logged yet.</p>
                ) : (
                  Object.entries(analytics.wasteByReason).map(([reason, units]) => {
                    const maxUnits = Math.max(1, ...Object.values(analytics.wasteByReason));
                    const pct = Math.round((units / (analytics.totalWastedUnits || 1)) * 100);
                    const barWidth = Math.round((units / maxUnits) * 100);

                    return (
                      <div key={reason} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200 truncate max-w-[180px]">{reason}</span>
                          <span className="text-slate-400 font-mono">
                            {units} Units <span className="text-[10px]">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chart 3: Expiry vs Used vs Wasted */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">Expiry vs Used vs Wasted</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Stock Lifecycle</span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Safe Active Reserve', value: analytics.expiryVsUsedVsWasted.safe, color: 'from-emerald-600 to-emerald-400', badge: '🟢 Safe' },
                  { label: 'Expiring Soon', value: analytics.expiryVsUsedVsWasted.expiringSoon, color: 'from-amber-600 to-amber-400', badge: '🟡 Expiring' },
                  { label: 'Expired', value: analytics.expiryVsUsedVsWasted.expired, color: 'from-red-600 to-red-400', badge: '🔴 Expired' },
                  { label: 'Used / Issued', value: analytics.expiryVsUsedVsWasted.used, color: 'from-blue-600 to-blue-400', badge: '🔵 Used' },
                  { label: 'Wasted / Discarded', value: analytics.expiryVsUsedVsWasted.wasted, color: 'from-zinc-600 to-zinc-400', badge: '⚫ Wasted' },
                ].map((item) => {
                  const total = Object.values(analytics.expiryVsUsedVsWasted).reduce((a, b) => a + b, 0) || 1;
                  const pct = Math.round((item.value / total) * 100);

                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">{item.label}</span>
                        <span className="font-mono text-white font-bold">
                          {item.value} <span className="text-slate-400 text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Monthly Trend & Facility Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly Trend */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-black text-white">Monthly Blood Waste Trend</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Past 6 Months</span>
              </div>

              {analytics.monthlyTrend.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No historical monthly records available yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.monthlyTrend.map((m) => {
                    const max = Math.max(1, ...analytics.monthlyTrend.map((t) => t.wastedUnits));
                    const width = Math.round((m.wastedUnits / max) * 100);
                    return (
                      <div key={m.month} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{m.month}</span>
                          <span className="font-mono text-brand-bright font-bold">
                            {m.wastedUnits} Units <span className="text-slate-400 text-[10px]">({m.recordCount} logs)</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-600 to-red-400 rounded-full"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Waste by Organization (Government View & Multi-Hub) */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">Facility Waste Audit Ledger</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Highest Discards</span>
              </div>

              {analytics.wasteByOrganization.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No organization waste records recorded.</p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {analytics.wasteByOrganization.map((org) => (
                    <div
                      key={org.id}
                      className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">{org.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {org.city} • {org.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-lg bg-red-950 text-red-300 border border-red-800 font-mono font-bold text-xs">
                          {org.wastedUnits} Units
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: SMART WASTE PREVENTION INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Smart Waste Prevention Insights</h3>
                <p className="text-xs text-slate-400">
                  Data-driven rules and telemetry patterns derived from active database storage records
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-red-950 text-red-300 rounded-lg border border-red-800">
              Heuristic Engine v2.4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const borderCol =
                insight.type === 'alert'
                  ? 'border-red-500/50 bg-red-950/30'
                  : insight.type === 'warning'
                  ? 'border-amber-500/50 bg-amber-950/30'
                  : insight.type === 'success'
                  ? 'border-emerald-500/50 bg-emerald-950/30'
                  : 'border-blue-500/50 bg-blue-950/30';

              return (
                <div key={insight.id} className={`p-5 rounded-2xl border ${borderCol} space-y-3 relative`}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-black text-white">{insight.title}</h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-black/40 text-slate-300">
                      {insight.impact} IMPACT
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>

                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Action Recommendation:
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{insight.actionRecommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: EXPIRY ALERTS PANEL */}
      {activeTab === 'alerts' && (
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-black text-white">Active Expiry Alerts</h3>
                <p className="text-xs text-slate-400">Immediate clinical alerts requiring priority issue or quarantine</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-950 text-amber-300 rounded-lg border border-amber-800">
              {alerts.length} Active Notifications
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs">No active expiry alerts. All cold-chain stock is currently safe.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    alt.level === 'critical'
                      ? 'bg-red-950/40 border-red-500/50'
                      : 'bg-amber-950/30 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-black/50 border border-white/10 text-brand-bright font-black flex items-center justify-center text-xs shrink-0">
                      {alt.bloodGroup}
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-white">{alt.title}</div>
                      <p className="text-xs text-slate-300">{alt.message}</p>
                      <div className="text-[10px] font-mono text-slate-400">
                        Facility: {alt.facilityName} • Batch: {alt.batchNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        showToast(`Dispatched priority notification to inventory managers for batch ${alt.batchNumber}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: RECORD WASTE */}
      <RecordWasteModal
        isOpen={wasteModalOpen}
        onClose={() => {
          setWasteModalOpen(false);
          setSelectedBatchForWaste(null);
        }}
        batch={selectedBatchForWaste}
        bloodBankId={bloodBankId}
        hospitalId={hospitalId}
        onSuccess={() => {
          showToast('Blood waste record successfully saved in regulatory audit database.');
          loadData();
          if (onRefreshParent) onRefreshParent();
        }}
      />

      {/* MODAL: BATCH DETAILS */}
      {selectedBatchDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#111827] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Batch Cold-Chain Details</h3>
                <p className="text-xs font-mono text-slate-400">{selectedBatchDetails.batchNumber}</p>
              </div>
              <button
                onClick={() => setSelectedBatchDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Group</span>
                  <span className="font-bold text-white text-base">{selectedBatchDetails.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Component</span>
                  <span className="font-bold text-white">{selectedBatchDetails.component}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Units Available</span>
                  <span className="font-mono font-bold text-white text-base">{selectedBatchDetails.units} Units</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Dynamic Status</span>
                  {renderStatusBadge(selectedBatchDetails.calculatedStatus)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Collection Date</span>
                  <span className="text-slate-200">
                    {selectedBatchDetails.collectionDate
                      ? new Date(selectedBatchDetails.collectionDate).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Expiry Date</span>
                  <span className="font-bold text-red-300">
                    {new Date(selectedBatchDetails.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Organization & Storage Rack</span>
                <span className="font-bold text-white">{selectedBatchDetails.organizationName}</span>
                <span className="block text-slate-400 text-[10px] mt-0.5">{selectedBatchDetails.location}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedBatchDetails(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpiryWasteSection;
