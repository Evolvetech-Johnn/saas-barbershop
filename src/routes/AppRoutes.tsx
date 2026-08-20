import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from '@/context/TenantContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RoleBasedRoute } from '@/components/routes/RoleBasedRoute';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { WhatsAppProvider } from '@/context/WhatsAppContext';

// Cada página vira um chunk separado, carregado só quando a rota é visitada
// — evita um bundle único de ~1MB com todas as telas do app de uma vez.
const StyleguidePage = lazy(() => import('@/pages/StyleguidePage').then((m) => ({ default: m.StyleguidePage })));
const RelatoriosPage = lazy(() => import('@/pages/app/relatorios/RelatoriosPage').then((m) => ({ default: m.RelatoriosPage })));
const PaginaPublicaPage = lazy(() => import('@/pages/public/PaginaPublicaPage').then((m) => ({ default: m.PaginaPublicaPage })));
const AgendamentoPublicoPage = lazy(() => import('@/pages/public/AgendamentoPublicoPage').then((m) => ({ default: m.AgendamentoPublicoPage })));
const LoginPage = lazy(() => import('@/pages/app/LoginPage').then((m) => ({ default: m.LoginPage })));
const OnboardingPage = lazy(() => import('@/pages/app/OnboardingPage'));
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const AgendaPage = lazy(() => import('@/pages/app/AgendaPage').then((m) => ({ default: m.AgendaPage })));
const ClientesPage = lazy(() => import('@/pages/app/ClientesPage').then((m) => ({ default: m.ClientesPage })));
const ServicosPage = lazy(() => import('@/pages/app/ServicosPage').then((m) => ({ default: m.ServicosPage })));
const FinanceiroPage = lazy(() => import('@/pages/app/FinanceiroPage').then((m) => ({ default: m.FinanceiroPage })));
const EquipePage = lazy(() => import('@/pages/app/EquipePage').then((m) => ({ default: m.EquipePage })));
const ComissoesPage = lazy(() => import('@/pages/app/ComissoesPage').then((m) => ({ default: m.ComissoesPage })));
const EstoquePage = lazy(() => import('@/pages/app/EstoquePage').then((m) => ({ default: m.EstoquePage })));
const PlanosPage = lazy(() => import('@/pages/app/PlanosPage').then((m) => ({ default: m.PlanosPage })));
const ConfiguracoesPage = lazy(() => import('@/pages/app/ConfiguracoesPage').then((m) => ({ default: m.ConfiguracoesPage })));
const AssinaturaPage = lazy(() => import('@/pages/app/AssinaturaPage').then((m) => ({ default: m.AssinaturaPage })));
const MarketingPage = lazy(() => import('@/pages/app/marketing/MarketingPage').then((m) => ({ default: m.MarketingPage })));

// Super Admin Pages
const SuperAdminLoginPage = lazy(() => import('@/pages/superadmin/SuperAdminLoginPage').then((m) => ({ default: m.SuperAdminLoginPage })));
const TenantsPage = lazy(() => import('@/pages/superadmin/TenantsPage').then((m) => ({ default: m.TenantsPage })));
const TenantDetalhePage = lazy(() => import('@/pages/superadmin/TenantDetalhePage').then((m) => ({ default: m.TenantDetalhePage })));
const PlanosSaaSPage = lazy(() => import('@/pages/superadmin/PlanosSaaSPage').then((m) => ({ default: m.PlanosSaaSPage })));
const FaturamentoSaaSPage = lazy(() => import('@/pages/superadmin/FaturamentoSaaSPage').then((m) => ({ default: m.FaturamentoSaaSPage })));

const PageFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-950">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--tenant-accent)]" />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/app/login" replace />;
  }
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Keep for backwards compatibility — wrap with RoleBasedRoute at usage site.
  return <>{children}</>;
};

const AppRoutesContent: React.FC = () => {
  const { usuario } = useAuth();
  const { tenant, availableTenants, setTenant } = useTenant();

  React.useEffect(() => {
    if (usuario && availableTenants.length > 0) {
      const userTenant = availableTenants.find((t) => ((t as any)._id || t.id) === usuario.tenantId);
      if (userTenant) {
        setTenant(userTenant);
      }
    }
  }, [usuario, availableTenants, setTenant]);

  // Se o usuário está logado e o tenant carregou, verifica se o onboarding foi concluído
  const isFirstAccess = usuario && tenant && !tenant.onboardingConcluido;

  return (
    <Suspense fallback={<PageFallback />}>
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

      <Route path="/app/equipe" element={
        <ProtectedRoute>
          <AppLayout>
            <EquipePage />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/app/servicos" element={
        <ProtectedRoute>
          <AppLayout>
            <ServicosPage />
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
      <Route path="/app/marketing" element={
        <ProtectedRoute>
          <AppLayout>
            <MarketingPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      {/* WhatsApp: escondido até ter integração real (hoje é mock em localStorage) */}
      <Route path="/app/configuracoes" element={
        <ProtectedRoute>
          <AppLayout>
            <ConfiguracoesPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/app/assinatura" element={
        <ProtectedRoute>
          <AppLayout>
            <AssinaturaPage />
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
        <RoleBasedRoute allowedRoles={['admin']} redirectTo="/admin/login">
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
        </RoleBasedRoute>
      } />

      {/* Fallback para rotas não encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <TenantProvider>
        <AuthProvider>
          <ToastProvider>
            <WhatsAppProvider>
              <AppRoutesContent />
            </WhatsAppProvider>
          </ToastProvider>
        </AuthProvider>
      </TenantProvider>
    </Router>
  );
};
