import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider } from '@/context/TenantContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { StyleguidePage } from '@/pages/StyleguidePage';
import { PaginaPublicaPage } from '@/pages/public/PaginaPublicaPage';
import { LoginPage } from '@/pages/app/LoginPage';
import OnboardingPage from '@/pages/app/OnboardingPage';

// Componente para proteger rotas (requer autenticação)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/app/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutesContent: React.FC = () => {
  const { usuario } = useAuth();
  
  // Simulação: se o usuário for novo, redireciona para onboarding
  const isFirstAccess = usuario && usuario.id === '1'; // Ajuste conforme sua lógica
  
  return (
    <Routes>
      <Route path="/styleguide" element={<StyleguidePage />} />
      
      <Route path="/:slug" element={
        <PublicLayout>
          <PaginaPublicaPage />
        </PublicLayout>
      } />
      
      <Route path="/app/login" element={
        usuario ? (
          isFirstAccess ? (
            <Navigate to="/app/onboarding" replace />
          ) : (
            <Navigate to="/app/dashboard" replace />
          )
        ) : (
          <div className="min-h-screen bg-base-950 flex items-center justify-center p-4">
            <LoginPage />
          </div>
        )
      } />
      
      <Route path="/app/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      
      <Route path="/app/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <div className="text-center py-12">
              <h1 className="text-3xl font-serif font-bold mb-4">Dashboard</h1>
              <p className="text-support-300">Página inicial da barbearia</p>
            </div>
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/*" element={
        <ProtectedRoute>
          <AppLayout>
            <div className="text-center py-12">
              <h1 className="text-3xl font-serif font-bold mb-4">Área do Tenant</h1>
              <p className="text-support-300">Páginas em desenvolvimento</p>
            </div>
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/*" element={
        <SuperAdminLayout>
          <div className="text-center py-12">
            <h1 className="text-3xl font-serif font-bold mb-4">Painel Super Admin</h1>
            <p className="text-support-300">Páginas em desenvolvimento</p>
          </div>
        </SuperAdminLayout>
      } />
    </Routes>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <ToastProvider>
            <AppRoutesContent />
          </ToastProvider>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
};
