import { Bell, AlertCircle, Droplet, Trophy, Building2, CheckCircle2 } from 'lucide-react';

export const CitizenNotifications = () => {
  const notifications = [
    {
      id: 'n1',
      type: 'emergency',
      title: 'Emergency O- blood request nearby',
      message: 'A critical patient at City Hospital requires O- blood immediately. Distance: 2.4km.',
      time: '10 mins ago',
      read: false,
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    },
    {
      id: 'n2',
      type: 'donation',
      title: 'You may have a new donation opportunity',
      message: 'Based on your last donation, you are now eligible to donate blood again.',
      time: '2 days ago',
      read: false,
      icon: Droplet,
      color: 'text-brand-red',
      bg: 'bg-brand-red/10'
    },
    {
      id: 'n3',
      type: 'badge',
      title: 'Congratulations! You unlocked Bronze Donor.',
      message: 'Thank you for your 5th life-saving donation. Your new badge is now visible on your profile.',
      time: '1 week ago',
      read: true,
      icon: Trophy,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      id: 'n4',
      type: 'hospital',
      title: 'Blood availability updated at City Hospital',
      message: 'City Hospital recently updated their O+ blood stock to "Available".',
      time: '2 weeks ago',
      read: true,
      icon: Building2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-400" />
          Notification Center
        </h2>
        <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => {
          const Icon = notif.icon;
          return (
            <div 
              key={notif.id} 
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex gap-4 ${
                !notif.read 
                  ? 'bg-[#111827] border-white/10 shadow-lg' 
                  : 'bg-slate-900/50 border-white/5 opacity-80'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.bg}`}>
                <Icon className={`w-6 h-6 ${notif.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                  <h3 className={`text-base font-bold ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {notif.message}
                </p>
                
                {notif.type === 'emergency' && (
                  <div className="mt-3">
                    <button className="px-4 py-2 bg-brand-red hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">
                      View Request Details
                    </button>
                  </div>
                )}
              </div>
              
              {!notif.read && (
                <div className="w-2.5 h-2.5 bg-brand-red rounded-full shrink-0 mt-2"></div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
