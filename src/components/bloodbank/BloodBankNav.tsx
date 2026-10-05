import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Droplet, 
  LayoutDashboard, 
  Layers, 
  HeartHandshake, 
  Inbox, 
  Users, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ArrowLeft, 
  Sparkles 
} from 'lucide-react';
import type { BloodBank, BloodBankNotification } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { FindMatchingBloodModal } from './FindMatchingBloodModal';

interface BloodBankNavProps {
  bloodBank: BloodBank;
  activeTab?: string;
}

export const BloodBankNav = ({ bloodBank }: BloodBankNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [matchingModalOpen, setMatchingModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<BloodBankNotification[]>(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      path: `/blood-bank/${bloodBank.id}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      label: 'Inventory Ledger',
      path: `/blood-bank/${bloodBank.id}/inventory`,
      icon: Layers,
      badge: '8 Groups',
    },
    {
      id: 'donations',
      label: 'Donation Management',
      path: `/blood-bank/${bloodBank.id}/donations`,
      icon: HeartHandshake,
    },
    {
      id: 'requests',
      label: 'Blood Requisitions',
      path: `/blood-bank/${bloodBank.id}/requests`,
      icon: Inbox,
      badge: '3 Urgent',
      badgeColor: 'bg-red-600 text-white',
    },
    {
      id: 'donors',
      label: 'Donor Registry',
      path: `/blood-bank/${bloodBank.id}/donors`,
      icon: Users,
    },
    {
      id: 'settings',
      label: 'Portal Settings',
      path: `/blood-bank/${bloodBank.id}/settings`,
      icon: Settings,
    },
  ];

  return (
    <>
      {/* TOPBAR */}
      <header className="bg-[#111827] border-b border-white/10 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* LEFT: BRAND & FACILITY IDENTITY */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/blood-banks"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Blood Bank Directory"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Blood Banks</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-red to-brand-deep flex items-center justify-center text-white shadow-lg shadow-brand-red/30">
                <Droplet className="w-5 h-5 fill-current" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-black text-white leading-none">
                    {bloodBank.name}
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-red-950 border border-red-500/40 text-red-300">
                    {bloodBank.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Blood Bank Administrator Portal • {bloodBank.city}, {bloodBank.state}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: MATCH BUTTON, NOTIFICATIONS, LOGOUT, MOBILE TOGGLE */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* FIND MATCHING BLOOD CTA */}
            <button
              onClick={() => setMatchingModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-red/20 hover:bg-brand-red/30 border border-brand-red/40 text-brand-bright text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find Matching Blood</span>
            </button>

            {/* NOTIFICATION BELL WITH DROPDOWN */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATIONS DROPDOWN MENU */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111827] border border-white/15 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Portal Notifications
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 font-bold border border-red-800">
                        {unreadCount} Unread
                      </span>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                          n.read
                            ? 'bg-black/30 border-white/5 text-slate-400'
                            : 'bg-white/5 border-red-500/30 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{n.title}</span>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 text-center">
                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        navigate(`/blood-bank/${bloodBank.id}/requests`);
                      }}
                      className="text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      View All Clinical Requisitions →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => {
                navigate('/blood-banks');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* MOBILE MENU DRAWER BUTTON */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* SUBNAV DESKTOP TAB STRIP */}
        <div className="hidden lg:block bg-[#0B1220]/90 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="lg:hidden bg-[#0B1220] border-b border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                setMatchingModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-brand-red text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find Matching Blood</span>
            </button>

            <button
              onClick={() => navigate('/blood-banks')}
              className="px-3.5 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* MATCHING BLOOD MODAL */}
      <FindMatchingBloodModal
        isOpen={matchingModalOpen}
        onClose={() => setMatchingModalOpen(false)}
        currentBloodBankId={bloodBank.id}
      />
    </>
  );
};
