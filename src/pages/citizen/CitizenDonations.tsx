import { History, Droplet, ArrowDownToLine, Calendar, CheckCircle2 } from 'lucide-react';

export const CitizenDonations = () => {
  const donationHistory = [
    {
      id: 'DON-001',
      date: '12 Aug 2026',
      hospital: 'City Hospital',
      bloodGroup: 'O+',
      units: 1,
      status: 'Completed',
      notes: 'Standard whole blood donation.'
    },
    {
      id: 'DON-002',
      date: '05 Apr 2026',
      hospital: 'RIMS Blood Bank',
      bloodGroup: 'O+',
      units: 1,
      status: 'Completed',
      notes: 'Emergency donation drive.'
    },
    {
      id: 'DON-003',
      date: '10 Nov 2025',
      hospital: 'City Hospital',
      bloodGroup: 'O+',
      units: 1,
      status: 'Completed',
      notes: 'Standard whole blood donation.'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-400" />
              Donation History
            </h2>
            <p className="text-sm text-slate-400 mt-1">A record of your life-saving contributions.</p>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl border border-white/10 transition-colors flex items-center gap-2 self-start sm:self-auto">
            <ArrowDownToLine className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {donationHistory.length > 0 ? (
          <div className="space-y-4">
            {donationHistory.map(donation => (
              <div key={donation.id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0 mt-1">
                    <Droplet className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-black text-white">{donation.hospital}</h3>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1 uppercase">
                        <CheckCircle2 className="w-3 h-3" /> {donation.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {donation.date}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className="font-mono text-slate-500">{donation.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{donation.notes}</p>
                  </div>
                </div>

                <div className="md:text-right flex md:flex-col gap-4 md:gap-1 items-center md:items-end justify-between border-t border-white/5 md:border-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Donated</div>
                  <div className="text-xl font-black text-white flex items-baseline gap-1">
                    {donation.units} <span className="text-sm font-bold text-slate-500">Unit</span>
                  </div>
                  <div className="text-xs font-bold text-brand-red px-2 py-1 bg-brand-red/10 rounded-md border border-brand-red/20">
                    {donation.bloodGroup} Blood
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Droplet className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No donations yet</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              You haven't donated blood yet. Your first donation could save a life.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
