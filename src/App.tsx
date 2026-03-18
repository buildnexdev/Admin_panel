import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout, { GlobalLoader } from './components/Layout';
import BuildersProtectedRoute from './components/BuildersProtectedRoute';
import RootGate from './components/RootGate';
import Preloader from './components/Preloader';
import type { RootState } from './store/store';

// Lazy loaded pages to enable Suspense global loader
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Login = lazy(() => import('./pages/main-pages/Login'));
const Settings = lazy(() => import('./pages/main-pages/Settings'));
const Profile = lazy(() => import('./pages/main-pages/Profile'));

const CompanyDetails = lazy(() => import('./pages/menu-pages/CompanyDetails'));
const ContactInfo = lazy(() => import('./pages/menu-pages/ContactInfo'));
const RevenueReport = lazy(() => import('./pages/menu-pages/RevenueReport'));

// Builders
const ProjectUpload = lazy(() => import('./pages/unWanted/builders/ProjectUpload'));
const ManageProjects = lazy(() => import('./pages/unWanted/builders/ManageProjects'));
const ProjectGallery = lazy(() => import('./pages/menu-pages/ProjectGallery'));
const Categories = lazy(() => import('./pages/unWanted/builders/Categories'));
const HomeBannerUpload = lazy(() => import('./pages/menu-pages/HomeBannerUpload'));
const ServiceUpload = lazy(() => import('./pages/menu-pages/ServiceUpload'));
const BlogUpload = lazy(() => import('./pages/menu-pages/BlogUpload'));
const Quotations = lazy(() => import('./pages/quotation/Quotation'));
const QuotationView = lazy(() => import('./pages/quotation/QuotationView'));
const SrsImages = lazy(() => import('./pages/menu-pages/SrsImages'));
const ContactMessages = lazy(() => import('./pages/unWanted/builders/ContactMessages'));

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show preloader for 3 seconds initially
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const isQuotationLink = window.location.pathname.includes('quotation');

  return (
    <Router>
      {loading && !isQuotationLink && <Preloader />}
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route path="login" element={<Login />} />
          {/* Public: client opens this link to view quotation (no login) */}
          <Route path="quotation/:token" element={<Suspense fallback={<GlobalLoader />}><QuotationView /></Suspense>} />
          <Route path="waasphotographyandevents.quotationlink/:token" element={<Suspense fallback={<GlobalLoader />}><QuotationView /></Suspense>} />

          {/* / shows login when not authenticated, dashboard when authenticated */}
          <Route path="/" element={<RootGate />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />

              <Route path="company-details" element={<CompanyDetails />} />
              <Route path="contact-info" element={<ContactInfo />} />
              <Route path="revenue-report" element={<RevenueReport />} />
              <Route path="upload-project" element={<BuildersProtectedRoute><ProjectUpload /></BuildersProtectedRoute>} />
              <Route path="manage-projects" element={<BuildersProtectedRoute><ManageProjects /></BuildersProtectedRoute>} />
              <Route path="categories" element={<BuildersProtectedRoute><Categories /></BuildersProtectedRoute>} />
              <Route path="contact" element={<BuildersProtectedRoute><ContactMessages /></BuildersProtectedRoute>} />

              <Route path="project-gallery" element={<BuildersProtectedRoute><ProjectGallery /></BuildersProtectedRoute>} />
              <Route path="upload-home-banners" element={<BuildersProtectedRoute><HomeBannerUpload /></BuildersProtectedRoute>} />
              <Route path="services" element={<BuildersProtectedRoute><ServiceUpload /></BuildersProtectedRoute>} />
              <Route path="blog" element={<BuildersProtectedRoute><BlogUpload /></BuildersProtectedRoute>} />
              <Route path="quotation" element={<BuildersProtectedRoute><Quotations /></BuildersProtectedRoute>} />
              <Route path="srs-images" element={<BuildersProtectedRoute><SrsImages /></BuildersProtectedRoute>} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
