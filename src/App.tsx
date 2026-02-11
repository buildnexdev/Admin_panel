import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// School
import SchoolDashboard from './pages/school/SchoolDashboard';
import UploadContent from './pages/school/UploadContent';
import UploadImage from './pages/school/UploadImage';

// Photography
import PhotoDashboard from './pages/photography/PhotoDashboard';
import UploadGallery from './pages/photography/UploadGallery';

// Builders
import BuildersDashboard from './pages/builders/BuildersDashboard';
import ProjectUpload from './pages/builders/ProjectUpload';

function App() {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />

          <Route path="school" element={<SchoolDashboard />}>
            <Route path="upload-content" element={<UploadContent />} />
            <Route path="upload-image" element={<UploadImage />} />
          </Route>

          <Route path="photography" element={<PhotoDashboard />}>
            <Route path="upload-gallery" element={<UploadGallery />} />
          </Route>

          <Route path="builders" element={<BuildersDashboard />}>
            <Route path="upload-project" element={<ProjectUpload />} />
          </Route>
        </Route>

        {/* Catch-all route - redirect to login if not authenticated, otherwise to dashboard */}
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
