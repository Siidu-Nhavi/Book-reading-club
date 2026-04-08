import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import RouteFallback from "./components/layout/RouteFallback";
import ScrollManager from "./components/layout/ScrollManager";
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

const HomePage = lazy(() => import("./pages/HomePage"));
const BooksCatalogPage = lazy(() => import("./pages/BooksCatalogPage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const Login = lazy(() => import("./Auth/login"));
const Signup = lazy(() => import("./Auth/Signup"));
const DashboardLayout = lazy(() => import("./Dashboard/DashboardLayout"));
const DashboardHome = lazy(() => import("./Dashboard/DashboardHome"));
const UpdateProfile = lazy(() => import("./Profile/UpdateProfile"));
const AccountSettings = lazy(() => import("./Dashboard/AccountSettings"));

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksCatalogPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
