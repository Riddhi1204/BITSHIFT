import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Droplet, Edit2, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const CitizenProfile = () => {
  const navigate = useNavigate();
  const { citizenUser, logoutCitizen } = useAuth();
  
  const [profile, setProfile] = useState({
    name: citizenUser?.name || 'John Doe',
    email: citizenUser?.email || 'john.doe@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    age: 28,
    location: 'Ranchi, Jharkhand',
    totalDonations: 6
  });

  useEffect(() => {
    if (citizenUser) {
      setProfile(prev => ({
        ...prev,
        name: citizenUser.name,
        email: citizenUser.email
      }));
    }
  }, [citizenUser]);

  const handleLogout = () => {
    logoutCitizen();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* PROFILE LEFT */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-1">
                <div className="w-full h-full bg-[#111827] rounded-[22px] overflow-hidden flex items-center justify-center">
                  <User className="w-16 h-16 text-blue-400" />
                </div>
              </div>
              <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-brand-red text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{profile.name}</h2>
              <div className="text-sm font-bold text-slate-400 mt-1">{profile.email}</div>
            </div>

            <div className="w-full bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Group</div>
              <div className="text-2xl font-black text-brand-red flex items-center justify-center gap-2">
                <Droplet className="w-5 h-5" />
                {profile.bloodGroup}
              </div>
            </div>

            <div className="w-full flex gap-3">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* PROFILE RIGHT */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white">Personal Information</h3>
              <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <div className="text-base font-bold text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                  {profile.name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <div className="text-base font-bold text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                  {profile.email}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <div className="text-base font-bold text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                  {profile.phone}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Age
                </label>
                <div className="text-base font-bold text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                  {profile.age} Years
                </div>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <div className="text-base font-bold text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-white/5">
                  {profile.location}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-lg font-black text-white mb-4">Account Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-brand-red" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{profile.totalDonations}</div>
                    <div className="text-xs font-bold text-red-300">Total Donations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
