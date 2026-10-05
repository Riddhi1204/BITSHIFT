import { useState } from 'react';
import { 
  Droplet, 
  AlertCircle, 
  MapPin, 
  Bot, 
  Sparkles, 
  Download, 
  Check, 
  Heart, 
  ShieldCheck, 
  BellRing,
  Clock,
  Navigation
} from 'lucide-react';

export const AboutAppSection = () => {
  const [canDonateClicked, setCanDonateClicked] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  const features = [
    {
      icon: Droplet,
      title: 'Smart Donor Matching',
      desc: 'AI matches donors based on blood group, location and availability.',
      color: 'text-brand-red',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      icon: BellRing,
      title: 'Emergency Alerts',
      desc: 'Receive verified urgent blood requirement notifications.',
      color: 'text-brand-bright',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      icon: MapPin,
      title: 'Nearby Blood Resources',
      desc: 'Find nearby blood banks, donors and blood availability.',
      color: 'text-brand-blue',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      icon: Bot,
      title: 'AI Blood Assistant',
      desc: 'Get help finding verified blood resources quickly.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* LEFT SIDE (5 COLS): PREMIUM SMARTPHONE APP MOCKUP */}
          <div className="lg:col-span-5 flex justify-center">
            
            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              
              {/* SUBTLE RED/WINE GLOW BEHIND MOCKUP */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-deep/30 via-brand-red/20 to-brand-blue/20 rounded-[44px] blur-2xl opacity-75 animate-pulse-subtle" />

              {/* SMARTPHONE DEVICE FRAME */}
              <div className="relative rounded-[40px] bg-[#0B1220] p-3 shadow-2xl border-[6px] border-slate-800 shadow-slate-900/30">
                
                {/* NOTCH / DYNAMIC ISLAND */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                </div>

                {/* APP SCREEN CONTAINER */}
                <div className="rounded-[30px] bg-gradient-to-b from-[#111827] via-[#0B1220] to-[#0B1220] text-white p-4 pt-8 space-y-3.5 overflow-hidden border border-white/10">
                  
                  {/* APP TOP STATUS & GREETING */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-md shadow-brand-red/30">
                        <Droplet className="w-4 h-4 fill-white" />
                      </div>
                      <span className="font-extrabold text-sm text-white tracking-tight">Hemo<span className="text-brand-bright">Vite</span></span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Donor Active</span>
                    </div>
                  </div>

                  {/* USER GREETING */}
                  <div className="space-y-0.5">
                    <h4 className="text-base font-black text-white">Good Morning!</h4>
                    <p className="text-[11px] text-slate-400">Ready to save lives in your neighborhood?</p>
                  </div>

                  {/* URGENT BLOOD NOTIFICATION POPUP */}
                  <div className="rounded-xl bg-gradient-to-r from-red-950/90 to-red-900/70 border border-red-500/40 p-2.5 shadow-md space-y-1.5 animate-pulse-subtle">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-red-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span>EMERGENCY NOTIFICATION</span>
                      </span>
                      <span className="text-red-300 font-mono text-[9px]">Just now</span>
                    </div>
                    <p className="text-xs font-extrabold text-white leading-tight">
                      🚨 URGENT: B+ blood required nearby
                    </p>
                  </div>

                  {/* NEARBY BLOOD REQUESTS SECTION */}
                  <div className="space-y-2 pt-0.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Nearby Blood Requests</span>
                      <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-0.5">
                        <Navigation className="w-2.5 h-2.5" /> 2.4 km
                      </span>
                    </div>

                    {/* REQUEST CARD */}
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-3 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-red-400">🚨 O− Blood Required</span>
                          </div>
                          <div className="text-xs font-bold text-white">City Hospital</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>2 km away</span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">3 Units Required</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-red-600/30 text-red-300 border border-red-500/40 rounded-md font-black text-xs">
                          O−
                        </span>
                      </div>

                      {/* ACTION BUTTON */}
                      <button
                        onClick={() => setCanDonateClicked(true)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                          canDonateClicked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white shadow-red-950/50'
                        }`}
                      >
                        {canDonateClicked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Donation Slot Confirmed!</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3.5 h-3.5 text-white" />
                            <span>I Can Donate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* QUICK STATS IN-APP */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs pt-0.5">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                      <div className="text-[10px] text-slate-400">Your Blood Group</div>
                      <div className="font-extrabold text-white text-xs mt-0.5">O+ Positive</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                      <div className="text-[10px] text-slate-400">Last Donated</div>
                      <div className="font-extrabold text-emerald-400 text-xs mt-0.5">94 Days Ago (Eligible)</div>
                    </div>
                  </div>

                  {/* BOTTOM PHONE NAVIGATION BAR */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-around text-slate-400 text-[10px]">
                    <span className="text-red-400 font-bold flex flex-col items-center">
                      <Droplet className="w-3.5 h-3.5 fill-current" /> Home
                    </span>
                    <span className="flex flex-col items-center">
                      <MapPin className="w-3.5 h-3.5" /> Map
                    </span>
                    <span className="flex flex-col items-center">
                      <Clock className="w-3.5 h-3.5" /> History
                    </span>
                    <span className="flex flex-col items-center">
                      <Bot className="w-3.5 h-3.5" /> AI Chat
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE (7 COLS): ABOUT OUR APP CONTENT + 4 FEATURES + CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* TITLE & SUBTITLE */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Mobile Citizen & Donor Platform
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                About Our App
              </h2>

              <p className="text-base sm:text-lg font-semibold text-brand-red">
                “Find Blood. Help Someone. Save a Life.”
              </p>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              HemoVite Mobile App connects blood donors with people who urgently need blood. Users can register as donors, find nearby blood requests and blood banks, receive verified emergency alerts, and track their donations. AI-powered matching helps identify suitable nearby donors based on blood group, location, availability, and eligibility—making emergency blood coordination faster, safer, and smarter.
            </p>

            {/* 4 FEATURE HIGHLIGHTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-card-soft transition-all duration-200 space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.border} border flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* DOWNLOAD APK CTA STRIP */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-5 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* Android SVG */}
                  <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.1556-.269.0634-.6138-.2056-.7694-.269-.1556-.6138-.0633-.7694.2056l-2.0231 3.5041C15.42 8.2428 13.7663 7.915 12 7.915c-1.7663 0-3.42.3278-4.8804.8895L5.0965 5.3004c-.1556-.2689-.5004-.3612-.7694-.2056-.269.1556-.3612.5004-.2056.7694l1.996 3.4572C2.6842 11.2828.3435 15.1506 0 19.782h24c-.3435-4.6314-2.6842-8.4992-6.1185-10.4606"/>
                  </svg>
                  <span className="text-xs font-bold text-emerald-400">Available for Android (v2.4)</span>
                </div>
                <h4 className="text-base font-black text-white">Download the BloodGuard AI App</h4>
              </div>

              <a
                href="/downloads/HemoVite.apk"
                download="HemoVite.apk"
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-xs shadow-md shadow-red-950/50 hover:shadow-brand-red/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {downloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Downloading APK...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download APK</span>
                  </>
                )}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
