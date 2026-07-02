import React, { useState } from 'react';
import { TenantProvider } from '@/context/TenantContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Tooltip } from '@/components/ui/Tooltip';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

const StyleguideContent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-base-950 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">Design System</h1>
        <p className="text-support-300 mb-8">Guia de componentes UI</p>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Cores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-base-950 border border-base-800">
              <div className="w-full h-16 bg-base-950 rounded mb-2 border border-base-800" />
              <p className="text-sm">Base 950</p>
            </div>
            <div className="p-4 rounded-lg bg-base-950 border border-base-800">
              <div className="w-full h-16 bg-base-900 rounded mb-2" />
              <p className="text-sm">Base 900</p>
            </div>
            <div className="p-4 rounded-lg bg-base-950 border border-base-800">
              <div className="w-full h-16 bg-base-800 rounded mb-2" />
              <p className="text-sm">Base 800</p>
            </div>
            <div className="p-4 rounded-lg bg-base-950 border border-base-800">
              <div className="w-full h-16 bg-[var(--tenant-accent)] rounded mb-2" />
              <p className="text-sm">Acento (Tenant)</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Formulários</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-support-200 mb-2">Input</label>
              <Input placeholder="Digite algo..." />
            </div>
            <div>
              <label className="block text-sm text-support-200 mb-2">Select</label>
              <Select>
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Checkbox label="Aceito os termos" />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Avatars</h2>
          <div className="flex items-center gap-4">
            <Avatar name="João Silva" size="sm" />
            <Avatar name="Maria Santos" size="md" />
            <Avatar name="Carlos Pereira" size="lg" />
            <Avatar name="Ana Costa" size="xl" />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Cards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">Título do Card</h3>
              <p className="text-support-300">Conteúdo do card aqui.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">Outro Card</h3>
              <p className="text-support-300">Mais conteúdo exemplo.</p>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Tabs</h2>
          <Tabs tabs={[
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' },
          ]}>
            {(activeTab) => (
              <div className="p-4 bg-base-800 rounded-lg">
                <p>Conteúdo da {activeTab}</p>
              </div>
            )}
          </Tabs>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Tooltips</h2>
          <div className="flex gap-4">
            <Tooltip content="Tooltip no topo" position="top">
              <Button>Hover aqui</Button>
            </Tooltip>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Modal</h2>
          <div className="flex gap-4">
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => addToast('Mensagem de sucesso!', 'success')}>Success Toast</Button>
            <Button onClick={() => addToast('Mensagem de erro!', 'error')}>Error Toast</Button>
            <Button onClick={() => addToast('Mensagem de aviso!', 'warning')}>Warning Toast</Button>
            <Button onClick={() => addToast('Mensagem de informação!', 'info')}>Info Toast</Button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-base-800 pb-2">Tabela</h2>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Data</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Cliente 1</TableCell>
                  <TableCell><Badge variant="success">Ativo</Badge></TableCell>
                  <TableCell>01/01/2024</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cliente 2</TableCell>
                  <TableCell><Badge variant="warning">Pendente</Badge></TableCell>
                  <TableCell>02/01/2024</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Título do Modal"
        >
          <p className="text-support-200 mb-6">Conteúdo do modal aqui. Você pode adicionar qualquer componente dentro.</p>
          <div className="flex gap-4 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setModalOpen(false)}>Confirmar</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export const StyleguidePage: React.FC = () => {
  return (
    <TenantProvider>
      <ToastProvider>
        <StyleguideContent />
      </ToastProvider>
    </TenantProvider>
  );
};
