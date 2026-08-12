import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ArenaProvider } from './context/ArenaContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LaunchPage } from './pages/LaunchPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { WelcomePage } from './pages/WelcomePage';
import { ArenaMapPage } from './pages/ArenaMapPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { KitchenPage } from './pages/KitchenPage';
import { ReceptionPage } from './pages/ReceptionPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { HeaderHUD } from './components/HeaderHUD';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideHeaderRoutes = ['/', '/entry', '/signin', '/signup', '/forgot-password', '/welcome'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] flex flex-col font-sans">
      {showHeader && <HeaderHUD />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ArenaProvider>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LaunchPage />} />
              <Route path="/entry" element={<LaunchPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Welcome & Dashboard Routes */}
              <Route
                path="/welcome"
                element={
                  <ProtectedRoute>
                    <WelcomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ArenaMapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/arena"
                element={
                  <ProtectedRoute>
                    <ArenaMapPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected My Bookings */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Kitchen & Helpdesk */}
              <Route
                path="/kitchen"
                element={
                  <ProtectedRoute>
                    <KitchenPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception"
                element={
                  <ProtectedRoute>
                    <ReceptionPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Room Detail Routes (Spheres & Lounge) */}
              <Route
                path="/room/:roomId"
                element={
                  <ProtectedRoute>
                    <RoomDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/sphere1" element={<Navigate to="/room/sphere1" replace />} />
              <Route path="/sphere2" element={<Navigate to="/room/sphere2" replace />} />
              <Route path="/elite" element={<Navigate to="/room/elite" replace />} />
              <Route path="/lounge" element={<Navigate to="/room/lounge" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/arena" replace />} />
            </Routes>
          </AppLayout>
        </ArenaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
