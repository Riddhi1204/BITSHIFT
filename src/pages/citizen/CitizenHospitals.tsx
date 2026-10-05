import { Building2, MapPin, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export const CitizenHospitals = () => {
  const hospitals = [
    {
      id: 'HOS-001',
      name: 'City General Hospital',
      distance: '2.4 km',
      type: 'Hospital & Blood Bank',
      status: '🟢 Available',
      inventorySummary: 'A+, B+, O+',
      emergencyReady: true,
      address: '123 Health Avenue, City Center'
    },
    {
      id: 'HOS-002',
      name: 'RIMS Super Specialty',
      distance: '4.8 km',
      type: 'Hospital',
      status: '🟠 Limited',
      inventorySummary: 'O-, AB-',
      emergencyReady: false,
      address: 'Medical College Road, North District'
    },
    {
      id: 'HOS-003',
      name: 'Apollo Regional Center',
      distance: '6.2 km',
      type: 'Private Hospital',
      status: '🟢 Available',
      inventorySummary: 'All Blood Groups Available',
      emergencyReady: true,
      address: 'Highway 42, Metro Ring'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            Hospital Directory
          </h2>
          <p className="text-sm text-slate-400 mt-1">Verified healthcare facilities near you.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search hospitals..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 focus:border-blue-500/50 rounded-xl text-sm text-white outline-none"
          />
        </div>
      </div>

      {/* HOSPITAL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="bg-[#111827] border border-white/10 hover:border-white/20 transition-all rounded-3xl p-6 shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{hospital.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                    <span className="text-blue-400">{hospital.type}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {hospital.distance}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 flex-1 mb-6">
              <div className="text-sm text-slate-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-bold rounded-lg border border-slate-700">
                  Status: {hospital.status}
                </span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-bold rounded-lg border border-slate-700">
                  Blood: {hospital.inventorySummary}
                </span>
                {hospital.emergencyReady && (
                  <span className="px-2.5 py-1 bg-brand-red/10 text-brand-red text-[11px] font-bold rounded-lg border border-brand-red/20 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Emergency Ready
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all">
                View Details
              </button>
              <button className="flex-1 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-sm rounded-xl border border-blue-500/20 transition-all flex items-center justify-center gap-2">
                <span>Directions</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
