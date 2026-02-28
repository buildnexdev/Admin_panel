import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout, { GlobalLoader } from './components/Layout';
import BuildersProtectedRoute from './components/BuildersProtectedRoute';
import RootGate from './components/RootGate';

// Lazy loaded pages to enable Suspense global loader
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));
const ContactInfo = lazy(() => import('./pages/ContactInfo'));
const RevenueReport = lazy(() => import('./pages/RevenueReport'));

// Builders
const BuildersDashboard = lazy(() => import('./pages/builders/BuildersDashboard'));
const ProjectUpload = lazy(() => import('./pages/builders/ProjectUpload'));
const ManageProjects = lazy(() => import('./pages/builders/ManageProjects'));
const Categories = lazy(() => import('./pages/builders/Categories'));
const HomeBannerUpload = lazy(() => import('./pages/builders/HomeBannerUpload'));
const ServiceUpload = lazy(() => import('./pages/builders/ServiceUpload'));
const BlogUpload = lazy(() => import('./pages/builders/BlogUpload'));
const ContactMessages = lazy(() => import('./pages/builders/ContactMessages'));

function App() {
  return (
    <Router>
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route path="login" element={<Login />} />

          {/* / shows login when not authenticated, dashboard when authenticated */}
          <Route path="/" element={<RootGate />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />

            <Route path="company-details" element={<CompanyDetails />} />
            <Route path="contact-info" element={<ContactInfo />} />
            <Route path="revenue-report" element={<RevenueReport />} />

            <Route path="builders" element={<BuildersDashboard />}>
              <Route path="upload-project" element={<BuildersProtectedRoute><ProjectUpload /></BuildersProtectedRoute>} />
              <Route path="manage-projects" element={<BuildersProtectedRoute><ManageProjects /></BuildersProtectedRoute>} />
              <Route path="categories" element={<BuildersProtectedRoute><Categories /></BuildersProtectedRoute>} />
              <Route path="upload-home-banners" element={<BuildersProtectedRoute><HomeBannerUpload /></BuildersProtectedRoute>} />
              <Route path="services" element={<BuildersProtectedRoute><ServiceUpload /></BuildersProtectedRoute>} />
              <Route path="blog" element={<BuildersProtectedRoute><BlogUpload /></BuildersProtectedRoute>} />
              <Route path="contact" element={<BuildersProtectedRoute><ContactMessages /></BuildersProtectedRoute>} />
            </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
