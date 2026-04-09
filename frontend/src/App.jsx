import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AboutUsPage,
  AccountSettings,
  BookDetailPage,
  BooksCatalogPage,
  CareersPage,
  CommunityPage,
  DashboardHome,
  FeaturesPage,
  LandingPage,
  Login,
  NotFoundPage,
  PricingPage,
  PrivacyPolicyPage,
  Signup,
  SupportPage,
  TermsOfServicePage,
  UpdateProfile,
} from "./pages/index.js";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import ScrollManager from "./components/utils/ScrollManager";

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/books" element={<BooksCatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<UpdateProfile />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
