import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { HospitalList } from './pages/hospital/HospitalList';
import { HospitalDetails } from './pages/hospital/HospitalDetails';
import { HospitalAuth } from './pages/hospital/HospitalAuth';
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { Donate } from './pages/donor/Donate';
import { BloodBankList } from './pages/bloodbank/BloodBankList';
import { BloodBankDetails } from './pages/bloodbank/BloodBankDetails';
import { BloodBankAuth } from './pages/bloodbank/BloodBankAuth';
import { BloodBankDashboard } from './pages/bloodbank/BloodBankDashboard';
import { BloodBankInventory } from './pages/bloodbank/BloodBankInventory';
import { BloodBankDonations } from './pages/bloodbank/BloodBankDonations';
import { BloodBankRequests } from './pages/bloodbank/BloodBankRequests';
import { BloodBankDonors } from './pages/bloodbank/BloodBankDonors';
import { BloodBankSettings } from './pages/bloodbank/BloodBankSettings';
import { RolePortalModal } from './components/modals/RolePortalModal';
import { EmergencyRequestModal } from './components/modals/EmergencyRequestModal';
import { BloodFinderModal } from './components/modals/BloodFinderModal';
import type { UserRole } from './types';

export function App() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [finderModalOpen, setFinderModalOpen] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    if (role === 'hospital') {
      navigate('/hospitals');
      return;
    }
    if (role === 'blood_bank') {
      navigate('/blood-banks');
      return;
    }
    setSelectedRole(role);
  };

  const handleCloseRoleModal = () => {
    setSelectedRole(null);
  };

  return (
    <>
      <Routes>
        {/* HOMEPAGE ROUTE */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-brand-red selection:text-white">
              {/* STICKY NAVBAR */}
              <Navbar
                onSelectRole={handleSelectRole}
                onOpenEmergency={() => setEmergencyModalOpen(true)}
                onOpenFinder={() => setFinderModalOpen(true)}
              />

              {/* MAIN CONTENT / LANDING PAGE */}
              <div className="flex-grow">
                <Home
                  onSelectRole={handleSelectRole}
                  onOpenEmergency={() => setEmergencyModalOpen(true)}
                  onOpenFinder={() => setFinderModalOpen(true)}
                />
              </div>

              {/* FOOTER */}
              <Footer
                onSelectRole={handleSelectRole}
                onOpenEmergency={() => setEmergencyModalOpen(true)}
              />
            </div>
          }
        />

        {/* HOSPITAL PORTAL FLOW */}
        <Route path="/hospitals" element={<HospitalList />} />
        <Route path="/hospital/:hospitalId" element={<HospitalDetails />} />
        <Route path="/hospital/:hospitalId/auth" element={<HospitalAuth />} />
        <Route path="/hospital/:hospitalId/dashboard" element={<HospitalDashboard />} />

        {/* DONOR DONATION RESPONSE FLOW */}
        <Route path="/donate" element={<Donate />} />

        {/* BLOOD BANK PORTAL FLOW */}
        <Route path="/blood-banks" element={<BloodBankList />} />
        <Route path="/blood-bank/:bloodBankId" element={<BloodBankDetails />} />
        <Route path="/blood-bank/:bloodBankId/auth" element={<BloodBankAuth />} />
        <Route path="/blood-bank/:bloodBankId/dashboard" element={<BloodBankDashboard />} />
        <Route path="/blood-bank/:bloodBankId/inventory" element={<BloodBankInventory />} />
        <Route path="/blood-bank/:bloodBankId/donations" element={<BloodBankDonations />} />
        <Route path="/blood-bank/:bloodBankId/requests" element={<BloodBankRequests />} />
        <Route path="/blood-bank/:bloodBankId/donors" element={<BloodBankDonors />} />
        <Route path="/blood-bank/:bloodBankId/settings" element={<BloodBankSettings />} />

        {/* FALLBACK REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ROLE PORTAL MODAL (FOR GOVERNMENT & CITIZEN) */}
      <RolePortalModal
        role={selectedRole}
        onClose={handleCloseRoleModal}
      />

      {/* EMERGENCY REQUEST MODAL */}
      <EmergencyRequestModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* LIVE BLOOD RESOURCE FINDER MODAL */}
      <BloodFinderModal
        isOpen={finderModalOpen}
        onClose={() => setFinderModalOpen(false)}
        onOpenEmergency={() => {
          setFinderModalOpen(false);
          setEmergencyModalOpen(true);
        }}
      />
    </>
  );
}

export default App;
