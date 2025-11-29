import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Upload from "./pages/Upload";
import Timeline from "./pages/Timeline";
import DoctorQR from "./pages/DoctorQR";
import DoctorView from "./pages/DoctorView";
import HospitalQR from "./pages/HospitalQR";
import HospitalUpload from "./pages/HospitalUpload";
import ICEProfile from "./pages/ICEProfile";
import ICEQR from "./pages/ICEQR";
import ICEView from "./pages/ICEView";
import Audit from "./pages/Audit";
import AISummary from "./pages/AISummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Public Access Routes (no auth required) */}
            <Route path="/doctor/:token" element={<DoctorView />} />
            <Route
              path="/hospital-upload/:token"
              element={<HospitalUpload />}
            />
            <Route path="/ice/:token" element={<ICEView />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <Records />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timeline"
              element={
                <ProtectedRoute>
                  <Timeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr/doctor"
              element={
                <ProtectedRoute>
                  <DoctorQR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr/hospital"
              element={
                <ProtectedRoute>
                  <HospitalQR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ice/profile"
              element={
                <ProtectedRoute>
                  <ICEProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ice/qr"
              element={
                <ProtectedRoute>
                  <ICEQR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <Audit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai/summary"
              element={
                <ProtectedRoute>
                  <AISummary />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
