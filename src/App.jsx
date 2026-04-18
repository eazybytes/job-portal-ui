import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { CompaniesProvider } from "./contexts/CompaniesContext";
import { JobsDataProvider } from "./contexts/JobsDataContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Companies = lazy(() => import("./pages/Companies"));
const CompanyDetail = lazy(() => import("./pages/CompanyDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AppliedJobs = lazy(() => import("./pages/AppliedJobs"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const PostJob = lazy(() => import("./pages/PostJob"));
const MyJobs = lazy(() => import("./pages/MyJobs"));
const JobApplicants = lazy(() => import("./pages/JobApplicants"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const CompanyManagement = lazy(() => import("./pages/admin/CompanyManagement"));
const EmployerManagement = lazy(() => import("./pages/admin/EmployerManagement"));
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));

const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <JobsDataProvider>
        <JobProvider>
          <CompaniesProvider>
            <ThemeProvider>
              <Router>
                <ScrollToTop />
                <Suspense fallback={<PageSpinner />}>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="jobs" element={<Jobs />} />
                      <Route path="jobs/:id" element={<JobDetail />} />
                      <Route path="companies" element={<Companies />} />
                      <Route path="companies/:id" element={<CompanyDetail />} />

                      {/* Job Seeker Routes */}
                      <Route
                        path="profile"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="applied-jobs"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                            <AppliedJobs />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="saved-jobs"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                            <SavedJobs />
                          </ProtectedRoute>
                        }
                      />

                      {/* Employer Routes */}
                      <Route
                        path="post-job"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                            <PostJob />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="employer/jobs"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                            <MyJobs />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="job-applicants/:jobId"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                            <JobApplicants />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes */}
                      <Route
                        path="admin"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/companies"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <CompanyManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/employers"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <EmployerManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/contact-messages"
                        element={
                          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <ContactMessages />
                          </ProtectedRoute>
                        }
                      />

                      {/* Auth Routes */}
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />

                      {/* Contact Route */}
                      <Route path="contact" element={<Contact />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </ThemeProvider>
          </CompaniesProvider>
        </JobProvider>
      </JobsDataProvider>
    </AuthProvider>
  );
}

export default App;
