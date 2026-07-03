import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from '@/context/TenantContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { WhatsAppProvider } from '@/context/WhatsAppContext';
import { StyleguidePage } from '@/pages/StyleguidePage';
import { WhatsAppPage } from '@/pages/app/whatsapp/WhatsAppPage';
import { RelatoriosPage } from '@/pages/app/relatorios/RelatoriosPage';
import { PaginaPublicaPage } from '@/pages/public/PaginaPublicaPage';
import { AgendamentoPublicoPage } from '@/pages/public/AgendamentoPublicoPage';
import { LoginPage } from '@/pages/app/LoginPage';
import OnboardingPage from '@/pages/app/OnboardingPage';
import { DashboardPage } from '@/pages/app/DashboardPage';
import { AgendaPage } from '@/pages/app/AgendaPage';
import { ClientesPage } from '@/pages/app/ClientesPage';
import { FinanceiroPage } from '@/pages/app/FinanceiroPage';
import { ComissoesPage } from '@/pages/app/ComissoesPage';
import { EstoquePage } from '@/pages/app/EstoquePage';
import { PlanosPage } from '@/pages/app/PlanosPage';
import { ConfiguracoesPage } from '@/pages/app/ConfiguracoesPage';

// Super Admin Pages
import { SuperAdminLoginPage } from '@/pages/superadmin/SuperAdminLoginPage';
import { TenantsPage } from '@/pages/superadmin/TenantsPage';
import { TenantDetalhePage } from '@/pages/superadmin/TenantDetalhePage';
import { PlanosSaaSPage } from '@/pages/superadmin/PlanosSaaSPage';
import { FaturamentoSaaSPage } from '@/pages/superadmin/FaturamentoSaaSPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/app/login" replace />;
  }
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAdmin = localStorage.getItem('saas_superadmin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutesContent: React.FC = () => {
  const { usuario } = useAuth();
  const { tenant } = useTenant();
  
  // Se o usuário está logado e o tenant carregou, verifica se o onboarding foi concluído
  const isFirstAccess = usuario && tenant && !tenant.onboardingConcluido;

  return (
    <Routes>
      <Route path="/styleguide" element={<StyleguidePage />} />

      <Route path="/:slug" element={
        <PublicLayout>
          <PaginaPublicaPage />
        </PublicLayout>
      } />
      <Route path="/:slug/agendar" element={
        <PublicLayout>
          <AgendamentoPublicoPage />
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
          {isFirstAccess ? <OnboardingPage /> : <Navigate to="/app/dashboard" replace />}
        </ProtectedRoute>
      } />

      <Route path="/app/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/app/agenda" element={
        <ProtectedRoute>
          <AppLayout>
            <AgendaPage />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/app/clientes" element={
        <ProtectedRoute>
          <AppLayout>
            <ClientesPage />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/app/financeiro" element={
        <ProtectedRoute>
          <AppLayout>
            <FinanceiroPage />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/app/comissoes" element={
        <ProtectedRoute>
          <AppLayout>
            <ComissoesPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/app/estoque" element={
        <ProtectedRoute>
          <AppLayout>
            <EstoquePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/app/planos" element={
        <ProtectedRoute>
          <AppLayout>
            <PlanosPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/app/relatorios" element={
        <ProtectedRoute>
          <AppLayout>
            <RelatoriosPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/app/whatsapp" element={
        <ProtectedRoute>
          <AppLayout>
            <WhatsAppPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/app/configuracoes" element={
        <ProtectedRoute>
          <AppLayout>
            <ConfiguracoesPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/app/login" replace />} />
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

      <Route path="/admin/login" element={<SuperAdminLoginPage />} />

      <Route path="/admin/*" element={
        <AdminProtectedRoute>
          <SuperAdminLayout>
            <Routes>
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="tenants/:id" element={<TenantDetalhePage />} />
              <Route path="planos" element={<PlanosSaaSPage />} />
              <Route path="faturamento" element={<FaturamentoSaaSPage />} />
              <Route path="*" element={<Navigate to="tenants" replace />} />
            </Routes>
          </SuperAdminLayout>
        </AdminProtectedRoute>
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
            <WhatsAppProvider>
              <AppRoutesContent />
            </WhatsAppProvider>
          </ToastProvider>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
};
