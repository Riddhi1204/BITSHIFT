import { PromoBanner } from '../components/PromoBanner';
import { Hero } from '../components/Hero';
import { FeatureStrip } from '../components/FeatureStrip';
import { AboutAppSection } from '../components/AboutAppSection';
import { AccessCards } from '../components/AccessCards';
import { PredictionSection } from '../components/PredictionSection';
import { HowItWorks } from '../components/HowItWorks';
import { EmergencySection } from '../components/EmergencySection';
import { Statistics } from '../components/Statistics';
import { Contact } from '../components/Contact';
import type { UserRole } from '../types';

interface HomeProps {
  onSelectRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
  onOpenFinder: () => void;
}

export const Home = ({ onSelectRole, onOpenEmergency, onOpenFinder }: HomeProps) => {
  return (
    <main className="min-h-screen">
      {/* 0. PROMOTIONAL / COVER BANNER */}
      <PromoBanner />

      {/* 1. HERO BANNER: 2-COLUMN WITH HEADLINE ON LEFT & HOSPITAL SHORTAGE RISK MONITOR ON RIGHT */}
      <Hero 
        onSelectRole={onSelectRole} 
        onOpenEmergency={onOpenEmergency} 
      />

      {/* 2. FEATURE / TRUST STRIP */}
      <FeatureStrip />

      {/* 3. ABOUT OUR APP SECTION (MOBILE CITIZEN & DONOR SHOWCASE) */}
      <AboutAppSection />

      {/* 4. SELECT YOUR ACCESS (4 TILES WITH RED-WINE HOVER EFFECT) + DOWNLOAD APK GLIDE CARD BESIDE IT */}
      <AccessCards onSelectRole={onSelectRole} />

      {/* 5. AI PREDICTION SECTION (DASHBOARD, GRAPHS, WHAT-IF & SHAP) */}
      <PredictionSection />

      {/* 6. HOW BLOODGUARD AI WORKS (4 CONNECTED STEPS) */}
      <HowItWorks />

      {/* 7. EMERGENCY BLOOD REQUEST SECTION */}
      <EmergencySection 
        onOpenEmergency={onOpenEmergency} 
        onOpenFinder={onOpenFinder} 
      />

      {/* 8. IMPACT / STATISTICS */}
      <Statistics />

      {/* 9. CONTACT US SECTION */}
      <Contact />
    </main>
  );
};
