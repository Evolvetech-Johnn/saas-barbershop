import React, { useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Button } from '@/components/ui/Button';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { tenant, switchTenant, availableTenants } = useTenant();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug && availableTenants.length > 0) {
      if (!tenant || tenant.slug !== slug) {
        switchTenant(slug);
      }
    }
  }, [slug, availableTenants, tenant, switchTenant]);

  if (!tenant || tenant.slug !== slug) {
    return <div className="min-h-screen bg-base-950 flex items-center justify-center"><p className="text-support-300">Carregando...</p></div>;
  }

  return (
    <div className="min-h-screen bg-base-950">
      <header className="sticky top-0 z-40 bg-base-950/95 backdrop-blur border-b border-base-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={`/${tenant.slug}`} className="flex items-center gap-3">
              <img src={tenant.logoUrl} alt={tenant.nome} className="w-10 h-10 rounded-full object-cover" />
              <span className="text-xl font-serif font-semibold">{tenant.nome}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to={`/${tenant.slug}`} className="text-support-200 hover:text-[var(--tenant-accent)] transition-colors">
                Início
              </Link>
              <Link to={`/${tenant.slug}/#servicos`} className="text-support-200 hover:text-[var(--tenant-accent)] transition-colors">
                Serviços
              </Link>
              <Link to={`/${tenant.slug}/#equipe`} className="text-support-200 hover:text-[var(--tenant-accent)] transition-colors">
                Equipe
              </Link>
              <Link to={`/${tenant.slug}/#contato`} className="text-support-200 hover:text-[var(--tenant-accent)] transition-colors">
                Contato
              </Link>
              <Link to={`/${tenant.slug}/app/comissoes`} className="text-support-200 hover:text-[var(--tenant-accent)] transition-colors">
                Comissões
              </Link>
            </nav>
            <Link to={`/${tenant.slug}/agendar`}>
              <Button>Agendar Agora</Button>
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-base-800 bg-base-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={tenant.logoUrl} alt={tenant.nome} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-lg font-serif font-semibold">{tenant.nome}</span>
              </div>
              <p className="text-support-300 text-sm">{tenant.descricaoPublica}</p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Contato</h4>
              <p className="text-support-300 text-sm mb-2">{tenant.endereco}</p>
              <p className="text-support-300 text-sm">{tenant.telefone}</p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Horário</h4>
              <p className="text-support-300 text-sm">{tenant.horarioFuncionamento}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
