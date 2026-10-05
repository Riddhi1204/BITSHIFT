import { useState, useMemo } from 'react';
import {
  AlertOctagon,
  Flame,
  Search,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { MOCK_BLOOD_HOTSPOTS } from '../../data/mockData';
import type { BloodHotspot } from '../../types';

export const GovernmentHotspots = () => {
  const [hotspots] = useState<BloodHotspot[]>(MOCK_BLOOD_HOTSPOTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState<'All' | 'Critical' | 'High' | 'Moderate' | 'Stable'>('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const bloodGroups = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const states = useMemo(() => {
    const list = Array.from(new Set(MOCK_BLOOD_HOTSPOTS.map((h) => h.state)));
    return ['All', ...list.sort()];
  }, []);

  const filteredHotspots = useMemo(() => {
    return hotspots.filter((h) => {
      const matchSearch =
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.mostRequiredGroup.toLowerCase().includes(searchQuery.toLowerCase());

      const matchState = selectedState === 'All' || h.state === selectedState;
      const matchSeverity = selectedSeverity === 'All' || h.severity === selectedSeverity;
      const matchGroup =
        selectedGroup === 'All' ||
        h.mostRequiredGroup === selectedGroup ||
        Boolean(h.bloodGroupShortages[selectedGroup]);

      return matchSearch && matchState && matchSeverity && matchGroup;
    });
  }, [hotspots, searchQuery, selectedState, selectedSeverity, selectedGroup]);

  const handleTriggerDispatch = (hotspot: BloodHotspot) => {
    triggerToast(`🚨 Emergency Buffer Dispatch Protocol initialized for ${hotspot.city}! Inter-district transit active.`);
  };

  const totalDeficitUnits = hotspots.reduce((acc, curr) => acc + curr.totalShortage, 0);
  const totalPatientsAffected = hotspots.reduce((acc, curr) => acc + curr.patientsAffected, 0);
  const criticalCount = hotspots.filter((h) => h.severity === 'Critical').length;

  return (
    <GovernmentLayout activeNav="hotspots">
      <div className="space-y-6">
        
        {/* TOAST ALERT */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-red-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* HEADER & SUMMARY KPIS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Geospatial Deficit Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Urgent Blood Requirement Hotspots
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time regional blood shortages, critical group deficits, patient load, and inter-district emergency routing.
              </p>
            </div>

            {/* KEY METRICS SUMMARY */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-center">
                <span className="text-[10px] font-bold text-red-700 uppercase block">Critical Cities</span>
                <span className="text-lg font-black text-red-900 font-mono">{criticalCount}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Deficit</span>
                <span className="text-lg font-black text-slate-900 font-mono">{totalDeficitUnits} Units</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Patients Impacted</span>
                <span className="text-lg font-black text-amber-900 font-mono">{totalPatientsAffected}</span>
              </div>
            </div>
          </div>

          {/* FILTERS TOOLBAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            {/* Search */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, state, or blood group..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
              />
            </div>

            {/* Severity Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                <option value="All">All Severity Levels</option>
                <option value="Critical">🔴 Critical Deficit</option>
                <option value="High">🟠 High Demand</option>
                <option value="Moderate">🟡 Moderate Demand</option>
                <option value="Stable">🟢 Stable Buffer</option>
              </select>
            </div>

            {/* Blood Group Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                {bloodGroups.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp === 'All' ? 'All Blood Groups' : `Filter by ${grp}`}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All States' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HOTSPOTS GRID (MAP-STYLE DETAILED CARDS)                 */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotspots.length > 0 ? (
            filteredHotspots.map((hotspot) => {
              const isCrit = hotspot.severity === 'Critical';
              const isHigh = hotspot.severity === 'High';
              const isMod = hotspot.severity === 'Moderate';

              return (
                <div
                  key={hotspot.id}
                  className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-sm space-y-5 transition-all relative overflow-hidden ${
                    isCrit
                      ? 'border-red-300 ring-1 ring-red-200'
                      : isHigh
                      ? 'border-orange-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* TOP ACCENT LINE */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isCrit ? 'bg-red-600' : isHigh ? 'bg-orange-500' : isMod ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                  />

                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-black text-slate-900">
                          {hotspot.city}
                        </h2>
                        <span className="text-xs text-slate-500 font-medium">({hotspot.state})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Last telemetry update: {hotspot.lastUpdated}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                        isCrit
                          ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                          : isHigh
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : isMod
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isCrit ? '🔴 Critical Deficit' : isHigh ? '🟠 High Demand' : isMod ? '🟡 Moderate' : '🟢 Stable'}
                    </span>
                  </div>

                  {/* IMPACT METRICS */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Shortage</span>
                      <span className="text-lg font-black text-red-600 font-mono block mt-0.5">
                        {hotspot.totalShortage}u
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Patients</span>
                      <span className="text-lg font-black text-slate-900 font-mono block mt-0.5">
                        {hotspot.patientsAffected}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Hospitals</span>
                      <span className="text-lg font-black text-slate-900 font-mono block mt-0.5">
                        {hotspot.hospitalsAffected}
                      </span>
                    </div>
                  </div>

                  {/* BLOOD GROUP DEFICIT BREAKDOWN */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Blood Component Deficit Breakdown:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {Object.entries(hotspot.bloodGroupShortages).map(([grp, data]) => {
                        const netDeficit = Math.max(0, data.required - data.available);
                        return (
                          <div
                            key={grp}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-slate-900 text-sm">{grp}</span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  data.urgency === 'Critical'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {data.urgency}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-500 flex justify-between">
                              <span>Req: <strong className="text-slate-900">{data.required}u</strong></span>
                              <span>Avail: <strong className="text-slate-700">{data.available}u</strong></span>
                            </div>

                            <div className="text-[11px] font-black text-red-600 pt-0.5 border-t border-slate-100">
                              Deficit: {netDeficit} Units
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTION PLAN RECOMMENDATION */}
                  {hotspot.actionPlan && (
                    <div className="p-3.5 rounded-2xl bg-red-950/5 border border-red-200/80 text-xs space-y-1">
                      <div className="font-bold text-red-900 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-red-600" />
                        <span>AI Transfusion Response Action Plan:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{hotspot.actionPlan}</p>
                    </div>
                  )}

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Window: {hotspot.urgencyWindow}</span>
                    </span>

                    <button
                      onClick={() => handleTriggerDispatch(hotspot)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Mobilize Buffer Transfer</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <AlertOctagon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-800">No hotspots matching selected filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('All');
                  setSelectedSeverity('All');
                  setSelectedGroup('All');
                }}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </GovernmentLayout>
  );
};
