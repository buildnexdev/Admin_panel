import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

import Login from './pages/Login';

// School
import SchoolDashboard from './pages/school/SchoolDashboard';
import UploadContent from './pages/school/UploadContent';
import UploadImage from './pages/school/UploadImage';
import SchoolProtectedRoute from './components/SchoolProtectedRoute';

// Photography
import PhotoDashboard from './pages/photography/PhotoDashboard';
import UploadGallery from './pages/photography/UploadGallery';
import PhotoProtectedRoute from './components/PhotoProtectedRoute';

// Builders
import BuildersDashboard from './pages/builders/BuildersDashboard';
import ProjectUpload from './pages/builders/ProjectUpload';
import HomeBannerUpload from './pages/builders/HomeBannerUpload';
import BuildersProtectedRoute from './components/BuildersProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout - All pages including login are within the layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          {/* Unified login route */}
          <Route path="login" element={<Login />} />

          {/* School routes */}
          <Route path="school" element={<SchoolDashboard />}>
            <Route path="upload-content" element={
              <SchoolProtectedRoute>
                <UploadContent />
              </SchoolProtectedRoute>
            } />
            <Route path="upload-image" element={
              <SchoolProtectedRoute>
                <UploadImage />
              </SchoolProtectedRoute>
            } />
          </Route>

          {/* Photography routes */}
          <Route path="photography" element={<PhotoDashboard />}>
            <Route path="upload-gallery" element={
              <PhotoProtectedRoute>
                <UploadGallery />
              </PhotoProtectedRoute>
            } />
          </Route>

          {/* Builders routes */}
          <Route path="builders" element={<BuildersDashboard />}>
            <Route path="upload-project" element={
              <BuildersProtectedRoute>
                <ProjectUpload />
              </BuildersProtectedRoute>
            } />
            <Route path="upload-home-banners" element={
              <BuildersProtectedRoute>
                <HomeBannerUpload />
              </BuildersProtectedRoute>
            } />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
