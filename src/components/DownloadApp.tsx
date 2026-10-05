import { useState } from 'react';
import { Download, Check, Bell, Navigation, ShieldCheck } from 'lucide-react';

export const DownloadAppCard = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1E293B] border border-white/15 p-6 text-white shadow-xl relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="space-y-3 max-w-md">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            {/* Android Icon SVG */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.1556-.269.0634-.6138-.2056-.7694-.269-.1556-.6138-.0633-.7694.2056l-2.0231 3.5041C15.42 8.2428 13.7663 7.915 12 7.915c-1.7663 0-3.42.3278-4.8804.8895L5.0965 5.3004c-.1556-.2689-.5004-.3612-.7694-.2056-.269.1556-.3612.5004-.2056.7694l1.996 3.4572C2.6842 11.2828.3435 15.1506 0 19.782h24c-.3435-4.6314-2.6842-8.4992-6.1185-10.4606"/>
            </svg>
            <span>Available for Android (APK v2.4)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Download the App APK
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get faster access to blood requests, donor alerts, emergency notifications and nearby blood availability directly from your pocket.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Bell className="w-3 h-3 text-red-400" /> Instant Push Alerts
            </span>
            <span className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-blue-400" /> Live GPS Donor Radar
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Facilities
            </span>
          </div>
        </div>

        {/* DOWNLOAD BUTTON */}
        <div className="shrink-0 w-full sm:w-auto">
          <a
            href="/downloads/BloodGuard-AI.apk"
            download="BloodGuard-AI.apk"
            onClick={handleDownload}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep hover:from-red-600 hover:to-red-800 text-white font-bold text-sm shadow-xl shadow-red-950/60 hover:shadow-brand-red/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 group"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloading APK...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                <span>Download APK</span>
              </>
            )}
          </a>
          <p className="text-[10px] text-center sm:text-right text-slate-400 mt-2">
            File Size: 18.4 MB • Free & Secure
          </p>
        </div>

      </div>

    </div>
  );
};
