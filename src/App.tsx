import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { HospitalList } from './pages/hospital/HospitalList';
import { HospitalDetails } from './pages/hospital/HospitalDetails';
import { HospitalAuth } from './pages/hospital/HospitalAuth';
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { HospitalStaffLogin } from './pages/hospital/HospitalStaffLogin';
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
import { CitizenAuthModal } from './components/modals/CitizenAuthModal';
import type { UserRole } from './types';

// Citizen Flow
import { CitizenAuth } from './pages/citizen/CitizenAuth';
import { CitizenForgotPassword } from './pages/citizen/CitizenForgotPassword';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { CitizenFindBlood } from './pages/citizen/CitizenFindBlood';
import { CitizenRequestBlood } from './pages/citizen/CitizenRequestBlood';
import { CitizenHospitals } from './pages/citizen/CitizenHospitals';
import { CitizenDonations } from './pages/citizen/CitizenDonations';
import { CitizenBadges } from './pages/citizen/CitizenBadges';
import { CitizenNotifications } from './pages/citizen/CitizenNotifications';
import { CitizenProfile } from './pages/citizen/CitizenProfile';
import { CitizenSettings } from './pages/citizen/CitizenSettings';
import { CitizenLayout } from './components/citizen/CitizenLayout';

// Government Flow
import { GovernmentAuth } from './pages/government/GovernmentAuth';
import { GovernmentForgotPassword } from './pages/government/GovernmentForgotPassword';
import { GovernmentDashboard } from './pages/government/GovernmentDashboard';
import { GovernmentHospitals } from './pages/government/GovernmentHospitals';
import { GovernmentHospitalDetails } from './pages/government/GovernmentHospitalDetails';
import { GovernmentHotspots } from './pages/government/GovernmentHotspots';
import { GovernmentDonations } from './pages/government/GovernmentDonations';
import { GovernmentSupply } from './pages/government/GovernmentSupply';
import { GovernmentReports } from './pages/government/GovernmentReports';
import { GovernmentSettings } from './pages/government/GovernmentSettings';

export function App() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [finderModalOpen, setFinderModalOpen] = useState(false);
  const [citizenAuthModalOpen, setCitizenAuthModalOpen] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    if (role === 'hospital') {
      navigate('/hospitals');
      return;
    }
    if (role === 'blood_bank') {
      navigate('/blood-banks');
      return;
    }
    if (role === 'government') {
      navigate('/government/login');
      return;
    }
    if (role === 'citizen') {
      setCitizenAuthModalOpen(true);
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
              <Navbar
                onSelectRole={handleSelectRole}
                onOpenEmergency={() => setEmergencyModalOpen(true)}
                onOpenFinder={() => setFinderModalOpen(true)}
              />

              <div className="flex-grow">
                <Home
                  onSelectRole={handleSelectRole}
                  onOpenEmergency={() => setEmergencyModalOpen(true)}
                  onOpenFinder={() => setFinderModalOpen(true)}
                />
              </div>

              <Footer
                onSelectRole={handleSelectRole}
                onOpenEmergency={() => setEmergencyModalOpen(true)}
              />
            </div>
          }
        />

        {/* CITIZEN ROUTES */}
        <Route path="/citizen/auth" element={<CitizenAuth />} />
        <Route path="/citizen/forgot-password" element={<CitizenForgotPassword />} />

        {/* Protected Citizen Routes wrapped in CitizenLayout */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="find-blood" element={<CitizenFindBlood />} />
          <Route path="request-blood" element={<CitizenRequestBlood />} />
          <Route path="hospitals" element={<CitizenHospitals />} />
          <Route path="donations" element={<CitizenDonations />} />
          <Route path="badges" element={<CitizenBadges />} />
          <Route path="notifications" element={<CitizenNotifications />} />
          <Route path="profile" element={<CitizenProfile />} />
          <Route path="settings" element={<CitizenSettings />} />
        </Route>

        {/* HOSPITAL PORTAL FLOW */}
        <Route path="/hospitals" element={<HospitalList />} />
        {/* Staff Login must be before /:hospitalId to avoid route conflict */}
        <Route path="/hospital/staff-login" element={<HospitalStaffLogin />} />
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

        {/* GOVERNMENT PORTAL FLOW */}
        <Route path="/government/login" element={<GovernmentAuth />} />
        <Route path="/government/register" element={<GovernmentAuth />} />
        <Route path="/government/forgot-password" element={<GovernmentForgotPassword />} />
        <Route path="/government/dashboard" element={<GovernmentDashboard />} />
        <Route path="/government/hospitals" element={<GovernmentHospitals />} />
        <Route path="/government/hospitals/:hospitalId" element={<GovernmentHospitalDetails />} />
        <Route path="/government/hotspots" element={<GovernmentHotspots />} />
        <Route path="/government/donations" element={<GovernmentDonations />} />
        <Route path="/government/supply" element={<GovernmentSupply />} />
        <Route path="/government/reports" element={<GovernmentReports />} />
        <Route path="/government/settings" element={<GovernmentSettings />} />

        {/* FALLBACK REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <RolePortalModal
        role={selectedRole}
        onClose={handleCloseRoleModal}
      />

      <EmergencyRequestModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      <BloodFinderModal
        isOpen={finderModalOpen}
        onClose={() => setFinderModalOpen(false)}
        onOpenEmergency={() => {
          setFinderModalOpen(false);
          setEmergencyModalOpen(true);
        }}
      />

      <CitizenAuthModal
        isOpen={citizenAuthModalOpen}
        onClose={() => setCitizenAuthModalOpen(false)}
      />
    </>
  );
}

export default App;
