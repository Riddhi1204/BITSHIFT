import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Landmark,
  Building2,
  AlertOctagon,
  BarChart3,
  Layers,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { DEFAULT_GOV_USER, MOCK_GOV_ALERTS } from '../../data/mockData';
import type { GovernmentUser } from '../../types';

interface GovernmentLayoutProps {
  children: React.ReactNode;
  activeNav?: 'dashboard' | 'hospitals' | 'hotspots' | 'donations' | 'supply' | 'reports' | 'settings';
}

export const GovernmentLayout = ({ children, activeNav = 'dashboard' }: GovernmentLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<GovernmentUser | null>(null);
  const [alerts, setAlerts] = useState(MOCK_GOV_ALERTS);

  // Authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem('hemovite_gov_user');
    if (!storedUser) {
      // If user is not authenticated, redirect to login
      navigate('/government/login', { replace: true });
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(DEFAULT_GOV_USER);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('hemovite_gov_user');
    navigate('/government/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      path: '/government/dashboard',
      icon: Activity,
      badge: null,
    },
    {
      id: 'hospitals',
      label: 'Hospital Verification',
      path: '/government/hospitals',
      icon: Building2,
      badge: '12 Pending',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'hotspots',
      label: 'Urgent Blood Hotspots',
      path: '/government/hotspots',
      icon: AlertOctagon,
      badge: '18 Critical',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    },
    {
      id: 'donations',
      label: 'Donation Analytics',
      path: '/government/donations',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'supply',
      label: 'Regional Blood Supply',
      path: '/government/supply',
      icon: Layers,
      badge: '10 States',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      id: 'reports',
      label: 'National Reports',
      path: '/government/reports',
      icon: FileText,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Portal Settings',
      path: '/government/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const unreadAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-brand-red selection:text-white font-sans">
      
      {/* ======================================================== */}
      {/* 1. TOP NATIONAL HEADER BAR (DARK NAVY / #0B1120)        */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#0B1120] border-b border-slate-800 text-white shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* LEFT: HEMOVITE LOGO + GOVERNMENT INTELLIGENCE CREST */}
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/government/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg tracking-tight text-white group-hover:text-red-400 transition-colors">
                      HemoVite
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-950/80 text-red-300 border border-red-700/50">
                      Gov Intelligence
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-none hidden sm:block">
                    National Blood Transfusion Oversight • MoHFW
                  </p>
                </div>
              </Link>
            </div>

            {/* RIGHT: NOTIFICATIONS, USER BADGE, LOGOUT */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              
              {/* LIVE SYNC STATUS BADGE */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Telemetry Active</span>
              </div>

              {/* NOTIFICATIONS DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Government Emergency Alerts"
                >
                  <Bell className="w-5 h-5" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center border-2 border-[#0B1120] animate-bounce">
                      {unreadAlertsCount}
                    </span>
                  )}
                </button>

                {/* NOTIFICATIONS PANEL */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl text-slate-100 z-50 p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4 text-red-400" />
                        <h4 className="font-bold text-sm text-white">Emergency Broadcasts</h4>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                        {unreadAlertsCount} Unresolved
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{alert.title}</span>
                            <span className="text-[10px] text-slate-400">{alert.time}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{alert.description}</p>
                          <div className="pt-1 flex items-center justify-between text-[11px]">
                            <span className="text-red-400 font-semibold">{alert.region}</span>
                            {alert.hotspotId && (
                              <button
                                onClick={() => {
                                  setNotifOpen(false);
                                  navigate('/government/hotspots');
                                }}
                                className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                              >
                                View Hotspot <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setAlerts(alerts.map(a => ({ ...a, resolved: true })));
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        Mark all acknowledged
                      </button>
                      <Link
                        to="/government/hotspots"
                        onClick={() => setNotifOpen(false)}
                        className="text-red-400 hover:text-red-300 font-semibold"
                      >
                        View all critical alerts →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* USER PROFILE INFO */}
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 font-bold text-sm shadow-inner">
                  {user?.name ? user.name.charAt(0) : 'G'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-xs text-white leading-tight">
                    {user?.name || DEFAULT_GOV_USER.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>State Health Admin</span>
                  </div>
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all"
                title="Log out of Government Portal"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE WITH SIDEBAR & CONTENT AREA             */}
      {/* ======================================================== */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col lg:flex-row gap-6">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 space-y-1">
            <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Intelligence Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id || location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* NATIONAL HELPLINE CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm border border-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-bold text-xs text-white">Emergency Control</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              24x7 Central Blood Transfusion Emergency Helpdesk for Inter-State Dispatches.
            </p>
            <div className="pt-1 flex items-center justify-between text-xs font-bold text-red-300">
              <span>Toll Free: 1800-11-2443</span>
            </div>
          </div>
        </aside>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-red-600" />
                    <span className="font-black text-slate-900 text-base">Government Portal</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id || location.pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-700 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN PAGE VIEWPORT */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

      {/* SUBTLE FOOTER STAMP */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HemoVite Healthcare Intelligence Platform • Government Oversight System</span>
          <span className="font-mono text-[11px] text-slate-400">Node ID: NBTC-GRID-V3 • Data Encrypted</span>
        </div>
      </footer>

    </div>
  );
};
