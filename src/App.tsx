import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout, { GlobalLoader } from './components/Layout';
import PermissionGuard from './components/PermissionGuard';
import RootGate from './components/RootGate';
import Preloader from './components/Preloader';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Login = lazy(() => import('./pages/main-pages/Login'));
const Settings = lazy(() => import('./pages/main-pages/Settings'));
const Profile = lazy(() => import('./pages/main-pages/Profile'));
const PublicReview = lazy(() => import('./pages/main-pages/PublicReview'));

const CompanyDetails = lazy(() => import('./pages/menu-pages/CompanyDetails'));
const ContactInfo = lazy(() => import('./pages/menu-pages/ContactInfo'));
const RevenueReport = lazy(() => import('./pages/menu-pages/RevenueReport'));

const ProjectUpload = lazy(() => import('./pages/unWanted/builders/ProjectUpload'));
const ManageProjects = lazy(() => import('./pages/unWanted/builders/ManageProjects'));
const ProjectGallery = lazy(() => import('./pages/menu-pages/ProjectGallery'));
const Categories = lazy(() => import('./pages/unWanted/builders/Categories'));
const HomeBannerUpload = lazy(() => import('./pages/menu-pages/HomeBannerUpload'));
const ServiceUpload = lazy(() => import('./pages/menu-pages/ServiceUpload'));
const BlogUpload = lazy(() => import('./pages/menu-pages/BlogUpload'));
const Quotations = lazy(() => import('./pages/quotation/Quotation'));
const QuotationCreate = lazy(() => import('./pages/quotation/QuotationCreate'));
const QuotationView = lazy(() => import('./pages/quotation/QuotationView'));
const SrsImages = lazy(() => import('./pages/menu-pages/SrsImages'));
const GoogleReviews = lazy(() => import('./pages/menu-pages/GoogleReviews'));
const TeamMembers = lazy(() => import('./pages/menu-pages/TeamMembers'));

const Staff = lazy(() => import('./pages/ops/Staff'));
const Roles = lazy(() => import('./pages/ops/Roles'));
const ComingSoon = lazy(() => import('./pages/ops/ComingSoon'));

function App() {
  // Short splash only — avoid forced 3s delay
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const isPublicLink =
    window.location.pathname.includes('quotation') ||
    window.location.pathname.includes('buildnexdevreview');

  const guard = (el: React.ReactNode, permission?: string | string[]) => (
    <PermissionGuard permission={permission}>{el}</PermissionGuard>
  );

  return (
    <Router>
      {loading && !isPublicLink && <Preloader />}
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="quotation/:token" element={<QuotationView />} />
          <Route path="waasphotographyandevents.quotationlink/:token" element={<QuotationView />} />
          <Route path="buildnexdevreview" element={<PublicReview />} />

          <Route path="/" element={<RootGate />}>
            <Route element={<Layout />}>
              <Route index element={guard(<Dashboard />, 'DASHBOARD_VIEW')} />
              <Route path="settings" element={guard(<Settings />, 'SETTINGS_VIEW')} />
              <Route path="profile" element={guard(<Profile />)} />

              <Route path="company-details" element={guard(<CompanyDetails />, ['COMPANY_VIEW', 'COMPANY_LIST_ALL'])} />
              <Route path="contact-info" element={guard(<ContactInfo />, 'CONTACT_VIEW')} />
              <Route path="revenue-report" element={guard(<RevenueReport />, 'REVENUE_VIEW')} />

              <Route path="upload-project" element={guard(<ProjectUpload />, 'PROJECT_CREATE')} />
              <Route path="manage-projects" element={guard(<ManageProjects />, 'PROJECT_VIEW')} />
              <Route path="categories" element={guard(<Categories />, 'CATEGORY_VIEW')} />
              {/* Duplicate contact route redirects to Contact Info */}
              <Route path="contact" element={<Navigate to="/contact-info" replace />} />

              <Route path="project-gallery" element={guard(<ProjectGallery />, 'PROJECT_VIEW')} />
              <Route path="upload-home-banners" element={guard(<HomeBannerUpload />, 'BANNER_VIEW')} />
              <Route path="services" element={guard(<ServiceUpload />, 'SERVICE_VIEW')} />
              <Route path="blog" element={guard(<BlogUpload />, 'BLOG_VIEW')} />
              <Route path="quotation" element={guard(<Quotations />, 'QUOTATION_VIEW')} />
              <Route path="quotation-create" element={guard(<QuotationCreate />, 'QUOTATION_CREATE')} />
              <Route path="srs-images" element={guard(<SrsImages />, 'SRS_VIEW')} />
              <Route path="google-reviews" element={guard(<GoogleReviews />, 'REVIEW_VIEW')} />
              <Route path="team-members" element={guard(<TeamMembers />, 'TEAM_VIEW')} />

              <Route path="staff" element={guard(<Staff />, 'STAFF_VIEW')} />
              <Route path="roles" element={guard(<Roles />, ['RBAC_VIEW', 'USER_MANAGE'])} />
              {/* Fake ops modules — no demo data */}
              <Route path="tasks" element={guard(<ComingSoon title="Tasks" />, 'TASK_VIEW')} />
              <Route path="tickets" element={guard(<ComingSoon title="Tickets" />, 'TICKET_VIEW')} />
              <Route path="accounts" element={guard(<ComingSoon title="Accounts" />, 'ACCOUNT_VIEW')} />
              <Route path="reports" element={guard(<ComingSoon title="Reports" />, 'REPORT_VIEW')} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
