import { useState, useMemo } from 'react';
import {
  BarChart3,
  Search
} from 'lucide-react';
import { GovernmentLayout } from '../../components/government/GovernmentLayout';
import { MOCK_DONATION_RECORDS } from '../../data/mockData';
import type { DonationRecord } from '../../types';

export const GovernmentDonations = () => {
  const [donations] = useState<DonationRecord[]>(MOCK_DONATION_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const bloodGroups = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const cities = useMemo(() => {
    const list = Array.from(new Set(MOCK_DONATION_RECORDS.map((d) => d.city)));
    return ['All', ...list.sort()];
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const matchSearch =
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.centerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity = selectedCity === 'All' || d.city === selectedCity;
      const matchGroup = selectedGroup === 'All' || d.bloodGroup === selectedGroup;

      return matchSearch && matchCity && matchGroup;
    });
  }, [donations, searchQuery, selectedCity, selectedGroup]);

  // Aggregate donation counts for chart simulation
  const bloodGroupDistribution = [
    { group: 'O+', units: 7800, percentage: 31.4, color: 'bg-red-600' },
    { group: 'A+', units: 5200, percentage: 20.9, color: 'bg-rose-500' },
    { group: 'B+', units: 6100, percentage: 24.5, color: 'bg-blue-600' },
    { group: 'AB+', units: 2100, percentage: 8.5, color: 'bg-purple-600' },
    { group: 'O-', units: 1450, percentage: 5.8, color: 'bg-red-800' },
    { group: 'A-', units: 980, percentage: 3.9, color: 'bg-rose-700' },
    { group: 'B-', units: 820, percentage: 3.3, color: 'bg-blue-800' },
    { group: 'AB-', units: 400, percentage: 1.6, color: 'bg-purple-800' },
  ];

  const cityDonationRankings = [
    { city: 'Delhi NCR', units: 5400, state: 'Delhi', activeCamps: 14 },
    { city: 'Mumbai', units: 4850, state: 'Maharashtra', activeCamps: 12 },
    { city: 'Bengaluru', units: 3900, state: 'Karnataka', activeCamps: 9 },
    { city: 'Chennai', units: 3450, state: 'Tamil Nadu', activeCamps: 8 },
    { city: 'Ranchi', units: 2450, state: 'Jharkhand', activeCamps: 6 },
    { city: 'Kolkata', units: 2300, state: 'West Bengal', activeCamps: 7 },
    { city: 'Patna', units: 1850, state: 'Bihar', activeCamps: 5 },
    { city: 'Lucknow', units: 1650, state: 'Uttar Pradesh', activeCamps: 4 },
  ];

  const monthlyTimeline = [
    { month: 'Oct 25', units: 3100, height: '55%' },
    { month: 'Nov 25', units: 3400, height: '62%' },
    { month: 'Dec 25', units: 4200, height: '78%' },
    { month: 'Jan 26', units: 4800, height: '88%' },
    { month: 'Feb 26', units: 4100, height: '75%' },
    { month: 'Mar 26', units: 5250, height: '98%' },
  ];

  return (
    <GovernmentLayout activeNav="donations">
      <div className="space-y-6">
        
        {/* HEADER & CONTROLS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>National Donor Engagement & Supply Metrics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Blood Donation Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Track voluntary donor turnouts, mobile donation drives, component collection velocity, and emergency apheresis.
              </p>
            </div>

            {/* TIME RANGE SELECTOR */}
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                {['Last 7 Days', 'Last 30 Days', 'This Quarter', 'All Time'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      dateRange === range
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FILTER CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor name, center, city, or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cities / Districts' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm text-slate-900 bg-slate-50/50 font-medium"
              >
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>
                    {g === 'All' ? 'All Blood Groups' : `Group: ${g}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* KPI SUMMARY CARDS (5 METRICS)                            */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Donations</span>
            <div className="text-2xl font-black text-slate-900 font-mono">24,850</div>
            <p className="text-[10px] text-emerald-600 font-medium">↑ 14.2% from last month</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Units Collected</span>
            <div className="text-2xl font-black text-red-600 font-mono">24,850 Units</div>
            <p className="text-[10px] text-slate-400">Whole Blood & Components</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Donors</span>
            <div className="text-2xl font-black text-blue-600 font-mono">14,200</div>
            <p className="text-[10px] text-blue-600 font-medium">Registered in network</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Daily Average</span>
            <div className="text-2xl font-black text-purple-600 font-mono">340 Units/day</div>
            <p className="text-[10px] text-slate-400">National pace</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Emergency Turnouts</span>
            <div className="text-2xl font-black text-rose-600 font-mono">1,840 Units</div>
            <p className="text-[10px] text-rose-600 font-medium">Direct trauma dispatch</p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CHARTS SECTION (4 INTERACTIVE SVG & VISUAL PANELS)       */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CHART 1 (7 COLS): BLOOD DONATIONS OVER TIME (TIMELINE) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Monthly Blood Donation Volume</h3>
                <p className="text-xs text-slate-500">6-Month historical trend across verified collection drives</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Peak: Mar 2026 (5,250u)
              </span>
            </div>

            {/* BAR VISUALIZER */}
            <div className="h-56 pt-6 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {monthlyTimeline.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    {item.units}u
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-red-700 to-rose-500 rounded-t-xl hover:opacity-90 transition-all cursor-pointer shadow-xs"
                    style={{ height: item.height }}
                  />
                  <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 2 (5 COLS): DONATIONS BY BLOOD GROUP DISTRIBUTION */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Donations by Blood Group</h3>
              <p className="text-xs text-slate-500">Breakdown across all 8 blood component groups</p>
            </div>

            <div className="space-y-2.5">
              {bloodGroupDistribution.map((bg) => (
                <div key={bg.group} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-black text-slate-800">{bg.group}</span>
                    <span className="font-mono text-slate-600">
                      {bg.units.toLocaleString()} Units ({bg.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bg.color} rounded-full`} style={{ width: `${bg.percentage * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 3 (7 COLS): CITY DONATION RANKINGS */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Top Regional Collection Rankings</h3>
              <p className="text-xs text-slate-500">Major metropolitan volume & active mobile donation camps</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cityDonationRankings.map((c, i) => (
                <div
                  key={c.city}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-500 text-[11px]">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{c.city}</div>
                      <div className="text-[10px] text-slate-400">{c.state} • {c.activeCamps} Camps</div>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 font-mono">{c.units.toLocaleString()}u</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 4 (5 COLS): EMERGENCY VS REGULAR BREAKDOWN */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Donation Type Channels</h3>
              <p className="text-xs text-slate-500">Voluntary camps vs walk-in regular dispatches</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Voluntary Public Camps</span>
                  <span className="font-mono">14,200 Units (57%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '57%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Hospital Center Walk-In</span>
                  <span className="font-mono">8,810 Units (35%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-rose-900">
                  <span>Emergency SOS Dispatch</span>
                  <span className="font-mono text-rose-700">1,840 Units (8%)</span>
                </div>
                <div className="w-full h-2.5 bg-rose-200 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* DONATION LOGS TABLE                                      */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Verified Donation Event Log</h3>
              <p className="text-xs text-slate-500">Live ledger of incoming blood collection records</p>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Showing {filteredDonations.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Collection Center</th>
                  <th className="py-3 px-4">City / State</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{don.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{don.donorName}</td>
                    <td className="py-3.5 px-4">
                      <span className="w-7 h-7 rounded-lg bg-red-50 text-red-700 font-black text-xs inline-flex items-center justify-center border border-red-200">
                        {don.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">+{don.units}</td>
                    <td className="py-3.5 px-4 text-slate-700">{don.centerName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{don.city}, {don.state}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">{don.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {don.donationType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          don.status === 'Stored'
                            ? 'bg-emerald-100 text-emerald-800'
                            : don.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {don.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </GovernmentLayout>
  );
};
