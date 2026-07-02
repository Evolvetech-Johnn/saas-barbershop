import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      addToast('Preencha todos os campos!', 'warning');
      return;
    }

    const success = await login(email, senha);
    
    if (success) {
      addToast('Login realizado com sucesso!', 'success');
      navigate('/app/dashboard');
    } else {
      addToast('Erro ao fazer login!', 'error');
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Entrar</h1>
        <p className="text-support-300">Acesse sua conta</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-support-200 mb-2">Email</label>
          <Input 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm text-support-200 mb-2">Senha</label>
          <Input 
            type="password" 
            placeholder="Sua senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Card>
  );
};
