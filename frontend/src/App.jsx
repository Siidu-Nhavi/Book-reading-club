import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AboutUsPage,
  AccountSettings,
  AdminBooksPage,
  AdminDashboard,
  AdminRentalsPage,
  AdminReturnsPage,
  AdminReviewsPage,
  AdminUsersPage,
  BookDetailPage,
  BooksCatalogPage,
  CareersPage,
  CommunityPage,
  DashboardHome,
  FeaturesPage,
  LandingPage,
  Login,
  MyRentalsPage,
  NotFoundPage,
  PricingPage,
  PrivacyPolicyPage,
  Signup,
  SupportPage,
  TermsOfServicePage,
  UpdateProfile,
  PaymentMethods,
} from "./pages/index.js";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { AdminLayout } from "./components/admin/index.js";
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

        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        {/* Convenience routes: keep legacy `/login` and `/signup` working */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          {/* Regular Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="rentals" element={<MyRentalsPage />} />
            <Route path="profile" element={<UpdateProfile />} />
            <Route path="profile/payment" element={<PaymentMethods />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          {/* Admin Dashboard Routes with AdminLayout */}
          <Route
            path="/dashboard/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/dashboard/admin/dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/dashboard/admin/books"
            element={
              <AdminLayout>
                <AdminBooksPage />
              </AdminLayout>
            }
          />
          <Route
            path="/dashboard/admin/users"
            element={
              <AdminLayout>
                <AdminUsersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/dashboard/admin/rentals"
            element={
              <AdminLayout>
                <AdminRentalsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/dashboard/admin/reviews"
            element={
              <AdminLayout>
                <AdminReviewsPage />
              </AdminLayout>
            }
          />
          {/* Legacy admin routes for backward compatibility */}
          <Route
            path="/dashboard/admin/returns"
            element={
              <AdminLayout>
                <AdminReturnsPage />
              </AdminLayout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
