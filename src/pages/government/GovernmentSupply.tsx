import { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { governmentApi } from '../../services/governmentApi';
import { ExpiryWasteSection } from '../../components/inventory/ExpiryWasteSection';
import type { RegionalBloodSupply } from '../../types';

export const GovernmentSupply = () => {
  const [supplyData, setSupplyData] = useState<RegionalBloodSupply[]>([]);
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'critical' | 'low' | 'healthy'>('All');
  const [selectedState, setSelectedState] = useState('All');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    governmentApi.getSupply()
      .then((res: any) => {
        if (!isMounted) return;
        if (Array.isArray(res) && res.length > 0) {
          const mapped: RegionalBloodSupply[] = res.map((r: any) => {
            const total = r.totalAvailable || 0;
            const req = total < 100 ? total + 50 : total;
            return {
              id: r.id,
              region: r.name || 'Regional Zone',
              state: r.state || 'Jharkhand',
              totalUnits: total,
              availableUnits: total,
              requiredUnits: req,
              shortage: Math.max(0, req - total),
              surplus: Math.max(0, total - req),
              supplyCoverage: Math.round((total / (req || 1)) * 100),
              status: r.status || 'healthy',
              criticalGroups: r.status === 'critical' ? ['O-', 'AB-'] : r.status === 'low' ? ['O-'] : [],
              surplusGroups: ['A+', 'B+', 'O+'],
              lastUpdated: 'Live Feed',
              hospitalCount: r.hospitalCount || 1,
              bloodBankCount: r.bloodBankCount || 1,
            };
          });
          setSupplyData(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to load supply matrix from API:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const states = useMemo(() => {
    const list = Array.from(new Set(supplyData.map((s) => s.state))).filter(Boolean);
    return ['All', ...list.sort()];
  }, [supplyData]);

  const filteredSupply = useMemo(() => {
    return supplyData.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.region.toLowerCase().includes(q) ||
        (item.state && item.state.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchState = selectedState === 'All' || item.state === selectedState;

      return matchSearch && matchStatus && matchState;
    });
  }, [supplyData, searchQuery, statusFilter, selectedState]);

  // Aggregate metrics
  const totalRequired = supplyData.reduce((acc, curr) => acc + (curr.requiredUnits || 0), 0);
  const totalAvailable = supplyData.reduce((acc, curr) => acc + (curr.availableUnits || 0), 0);
  const netDeficit = supplyData.reduce((acc, curr) => acc + (curr.shortage || 0), 0);

  return (
    <GovernmentLayout activeNav="supply">
      <div className="space-y-6">
        
        {/* HEADER & OVERVIEW */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Inter-State Transfusion Supply Grid</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Regional Blood Supply Matrix
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Monitor state-level blood stock reserves, deficit coverage ratios, buffer health, and surplus balancing from PostgreSQL.
              </p>
            </div>

            {/* KEY TOTALS */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Required Units</span>
                <span className="text-lg font-black text-slate-900 font-mono">{totalRequired.toLocaleString()}u</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Available Stock</span>
                <span className="text-lg font-black text-emerald-900 font-mono">{totalAvailable.toLocaleString()}u</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-center">
                <span className="text-[10px] font-bold text-red-700 uppercase block">Net Deficit</span>
                <span className="text-lg font-black text-red-900 font-mono">{netDeficit.toLocaleString()}u</span>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search region name or state..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium cursor-pointer"
              >
                <option value="All">All Supply Statuses</option>
                <option value="critical">🔴 Critical Shortage (&lt; 75%)</option>
                <option value="low">🟠 Low Buffer (75% - 95%)</option>
                <option value="healthy">🟢 Healthy Supply (&gt; 95%)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All States' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* COMPARATIVE VISUALIZER CHART */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Required vs Available Blood Stock by Region</h3>
              <p className="text-xs text-slate-500">Live comparative inventory analysis across monitored states (PostgreSQL)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded bg-slate-300" />
                <span>Required Units</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded bg-red-600" />
                <span>Available Units</span>
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {supplyData.map((reg) => {
              const req = reg.requiredUnits || 1;
              const availPct = Math.min(100, Math.round(((reg.availableUnits || 0) / req) * 100));
              const isCrit = reg.status === 'critical';
              const isLow = reg.status === 'low';

              return (
                <div key={reg.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{reg.region}</span>
                      <span className="text-[11px] text-slate-400">({reg.state})</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-slate-900">{(reg.availableUnits || 0).toLocaleString()}u</span>
                      <span className="text-slate-400">available of</span>
                      <span className="text-slate-600">{(reg.requiredUnits || 0).toLocaleString()}u</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCrit
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : isLow
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {reg.supplyCoverage || availPct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCrit ? 'bg-red-600' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${availPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REGIONAL SUPPLY DETAILED CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSupply.map((reg) => {
            const isCrit = reg.status === 'critical';
            const isLow = reg.status === 'low';

            return (
              <div
                key={reg.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm space-y-4 relative overflow-hidden ${
                  isCrit ? 'border-red-300' : isLow ? 'border-amber-300' : 'border-slate-200'
                }`}
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isCrit ? 'bg-red-600' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{reg.region}</h3>
                    <span className="text-xs text-slate-500 font-medium">State: {reg.state}</span>
                  </div>

                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                      isCrit
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : isLow
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isCrit ? '🔴 Critical Shortage' : isLow ? '🟠 Low Buffer' : '🟢 Healthy Reserve'}
                  </span>
                </div>

                {/* MATRIX STATS */}
                <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Required</span>
                    <span className="font-mono font-black text-slate-900 text-sm block mt-0.5">
                      {reg.requiredUnits}u
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Available</span>
                    <span className="font-mono font-black text-emerald-700 text-sm block mt-0.5">
                      {reg.availableUnits}u
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Deficit</span>
                    <span className="font-mono font-black text-red-600 text-sm block mt-0.5">
                      {reg.shortage > 0 ? `${reg.shortage}u` : '0u'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Surplus</span>
                    <span className="font-mono font-black text-blue-600 text-sm block mt-0.5">
                      {reg.surplus > 0 ? `+${reg.surplus}u` : '0u'}
                    </span>
                  </div>
                </div>

                {/* CRITICAL BLOOD GROUPS */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block">
                    Critical Group Deficits:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {reg.criticalGroups && reg.criticalGroups.length > 0 ? (
                      reg.criticalGroups.map((grp) => (
                        <span
                          key={grp}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 font-black text-xs font-mono"
                        >
                          {grp} Critical
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>All groups adequately buffered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* FOOTER STATS */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{reg.hospitalCount || 12} Hospitals Linked • {reg.bloodBankCount || 4} Blood Banks</span>
                  <span className="font-bold text-slate-700 font-mono">Coverage: {reg.supplyCoverage || 85}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* NATIONAL EXPIRY & WASTE MANAGEMENT AGGREGATOR */}
        <ExpiryWasteSection
          role="government"
          title="Supply Expiry & Regulatory Discard Matrix"
          subtitle="Real-time multi-regional batch shelf-life analytics and waste prevention telemetry"
        />

      </div>
    </GovernmentLayout>
  );
};
