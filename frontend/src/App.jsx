import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Auth/login";
import Signup from "./Auth/Signup";
import {
  AboutUsPage,
  AudioBooksPage,
  CareersPage,
  CommunityPage,
  ContactPage,
  FeaturesPage,
  HelpCenterPage,
  MobileAppPage,
  PressPage,
  PricingPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
} from "./Footer/index.js";
import LandingPage from "./LandingPage/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/mobile-app" element={<MobileAppPage />} />
        <Route path="/audio-books" element={<AudioBooksPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />

        <Route path="/dashboard" element={<h1>Dashboard (Protected)</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
