import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Droplet, 
  LayoutDashboard, 
  Search, 
  AlertCircle, 
  Building2, 
  History, 
  Award, 
  User, 
  Bell, 
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CitizenLayout = () => {
  const { citizenUser, logoutCitizen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { name: 'Find Blood', path: '/citizen/find-blood', icon: Search },
    { name: 'Request Blood', path: '/citizen/request-blood', icon: AlertCircle, emergency: true },
    { name: 'Nearby Hospitals', path: '/citizen/hospitals', icon: Building2 },
    { name: 'Donation History', path: '/citizen/donations', icon: History },
    { name: 'My Badges', path: '/citizen/badges', icon: Award },
    { name: 'Profile', path: '/citizen/profile', icon: User },
    { name: 'Notifications', path: '/citizen/notifications', icon: Bell },
    { name: 'Settings', path: '/citizen/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/citizen/dashboard': return { title: `Welcome, ${citizenUser ? citizenUser.name.split(' ')[0] : 'Citizen'} 👋`, subtitle: 'Your contribution can save lives.' };
      case '/citizen/find-blood': return { title: 'Find Blood', subtitle: 'Search verified blood availability near you.' };
      case '/citizen/request-blood': return { title: 'Emergency Request', subtitle: 'Create a life-saving blood request.' };
      case '/citizen/hospitals': return { title: 'Nearby Hospitals', subtitle: 'Hospitals and Blood Banks around you.' };
      case '/citizen/donations': return { title: 'Donation History', subtitle: 'Track your life-saving journey.' };
      case '/citizen/badges': return { title: 'Your Badges', subtitle: 'Achievements for your contributions.' };
      case '/citizen/notifications': return { title: 'Notifications', subtitle: 'Updates on your requests and availability.' };
      case '/citizen/profile': return { title: 'Your Profile', subtitle: 'Manage your personal and medical details.' };
      default: return { title: 'Citizen Portal', subtitle: 'HemoVite Dashboard' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex selection:bg-brand-red selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111827] border-r border-white/10 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-brand-deep rounded-xl flex items-center justify-center">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">HemoVite</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    item.emergency 
                      ? 'bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white border border-brand-red/20'
                      : isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              logoutCitizen();
              navigate('/');
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-bold text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & OVERLAY MENU */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111827] border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-red to-brand-deep rounded-lg flex items-center justify-center">
            <Droplet className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight">HemoVite</span>
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/citizen/notifications" className="relative text-slate-400 hover:text-white">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-[#111827]"></span>
          </NavLink>
          <button onClick={() => setMobileMenuOpen(true)} className="text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0B1220]/90 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#111827] shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right">
            <div className="p-4 flex justify-end border-b border-white/10">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-all ${
                        item.emergency 
                          ? 'bg-brand-red text-white shadow-md'
                          : isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  logoutCitizen();
                  navigate('/');
                }}
                className="flex items-center gap-3 px-3 py-3 w-full rounded-xl font-bold text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen pt-16 lg:pt-0">
        {/* DESKTOP HEADER */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#111827]/50 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-white">{title}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-5">
            <NavLink to="/citizen/request-blood" className="px-4 py-2 text-sm font-bold bg-brand-red hover:bg-red-600 text-white rounded-xl shadow-lg shadow-brand-red/20 transition-all flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>I Need Blood</span>
            </NavLink>
            <div className="h-6 w-px bg-white/10"></div>
            <NavLink to="/citizen/notifications" className="relative p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-[#111827]"></span>
            </NavLink>
            <NavLink to="/citizen/profile" className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-deep p-[2px]">
                <div className="w-full h-full bg-[#111827] rounded-[10px] overflow-hidden flex items-center justify-center font-bold text-white">
                  {citizenUser?.avatarUrl ? (
                    <img src={citizenUser.avatarUrl} alt={citizenUser.name} className="w-full h-full object-cover" />
                  ) : citizenUser ? (
                    citizenUser.avatarInitials
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
              <div className="hidden xl:block">
                <div className="text-sm font-bold text-white">{citizenUser ? citizenUser.name : 'Citizen User'}</div>
                <div className="text-[11px] font-medium text-emerald-400">
                  {citizenUser?.bloodGroup ? `${citizenUser.bloodGroup} Eligible` : 'Citizen'}
                </div>
              </div>
            </NavLink>
          </div>
        </header>

        {/* MOBILE PAGE TITLE (Visible below mobile header) */}
        <div className="lg:hidden px-4 pt-6 pb-2">
          <h1 className="text-xl font-black text-white">{title}</h1>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
