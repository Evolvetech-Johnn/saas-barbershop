import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const SuperAdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      addToast('Preencha todos os campos!', 'warning');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    // Hardcode mock admin login for preview
    if (email === 'admin@saas.com' && senha === 'admin123') {
      localStorage.setItem('saas_superadmin', 'true');
      addToast('Painel Super Admin acessado com sucesso!', 'success');
      navigate('/admin/tenants');
    } else {
      addToast('Credenciais inválidas! Use admin@saas.com e admin123.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border border-base-800 bg-base-900/50 backdrop-blur-sm shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-base-100 mb-2">SaaS Super Admin</h1>
          <p className="text-support-300">Acesse a administração da plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-support-200 mb-2">E-mail de Admin</label>
            <Input
              type="email"
              placeholder="admin@saas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-base-950 border-base-800 text-base-100 placeholder:text-support-400"
            />
          </div>

          <div>
            <label className="block text-sm text-support-200 mb-2">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              className="bg-base-950 border-base-800 text-base-100 placeholder:text-support-400"
            />
            <p className="text-xs text-support-400 mt-2">Dica: admin@saas.com / admin123</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--tenant-accent)] text-base-950 hover:opacity-90 font-medium"
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
