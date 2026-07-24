import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CalendarioAgenda } from '@/components/agenda/CalendarioAgenda';
import { useTenant } from '@/context/TenantContext';
import { agendamentoService } from '@/services/agendamentoService';
import { useToast } from '@/context/ToastContext';
import { useServicos } from '@/hooks/useServicos';
import { useProfissionais } from '@/hooks/useProfissionais';
import { Scissors, User as UserIcon, Calendar as CalendarIcon, CheckCircle2, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockHorarios = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

export const AgendamentoPublicoForm: React.FC = () => {
  const { tenant } = useTenant();
  const { addToast } = useToast();
  
  const { servicos } = useServicos();
  const { profissionais } = useProfissionais();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    servico: '',
    profissional: '',
    horario: '',
  });

  const servicoSelecionado = servicos.find((servico) => ((servico as any)._id || servico.id) === formData.servico);
  const duracaoMinutos = servicoSelecionado?.duracaoMinutos ?? 30;

  const horariosDisponiveis = mockHorarios;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenant) return;

    if (!formData.servico || !formData.profissional || !formData.horario) {
      addToast('Selecione serviço, profissional e horário para confirmar o agendamento.', 'error');
      return;
    }

    const [horas, minutos] = formData.horario.split(':').map(Number);
    const dataHora = new Date(selectedDate);
    dataHora.setHours(horas, minutos, 0, 0);

    try {
      const currentTenantId = (tenant as any)._id || tenant.id;
      await agendamentoService.create(currentTenantId, {
        clienteNome: formData.nome,
        clienteTelefone: formData.telefone,
        clienteEmail: formData.email,
        servicoId: formData.servico,
        profissionalId: formData.profissional,
        dataHora,
        duracaoMinutos,
        status: 'confirmado'
      });

      setStep(4);
    } catch (error: any) {
      addToast(error.message || 'Horário não disponível. Escolha outro.', 'error');
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.servico) return;
    if (step === 2 && !formData.profissional) return;
    if (step === 3 && !formData.horario) return;
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Resumo Lateral (Fixo em telas maiores) */}
      <div className="md:w-64 shrink-0 order-2 md:order-1">
        <div className="bg-surface-1 border border-border-subtle rounded-xl p-5 sticky top-8 shadow-sm">
          <h4 className="font-serif font-semibold text-text-primary mb-4 pb-4 border-b border-border-subtle">Seu Agendamento</h4>
          
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-text-muted mb-1 text-xs uppercase tracking-wider font-medium">Serviço</p>
              {servicoSelecionado ? (
                <div className="flex items-start gap-2">
                  <Scissors className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="font-medium text-text-primary">{servicoSelecionado.nome}</p>
                </div>
              ) : (
                <p className="text-text-muted italic">Pendente</p>
              )}
            </div>
            
            <div>
              <p className="text-text-muted mb-1 text-xs uppercase tracking-wider font-medium">Profissional</p>
              {formData.profissional ? (
                <div className="flex items-start gap-2">
                  <UserIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="font-medium text-text-primary">
                    {profissionais.find((p) => ((p as any)._id || p.id) === formData.profissional)?.nome}
                  </p>
                </div>
              ) : (
                <p className="text-text-muted italic">Pendente</p>
              )}
            </div>
            
            <div>
              <p className="text-text-muted mb-1 text-xs uppercase tracking-wider font-medium">Data e Hora</p>
              {formData.horario ? (
                <div className="flex items-start gap-2">
                  <CalendarIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">{selectedDate.toLocaleDateString('pt-BR')}</p>
                    <p className="text-text-secondary">{formData.horario}</p>
                  </div>
                </div>
              ) : (
                <p className="text-text-muted italic">Pendente</p>
              )}
            </div>
          </div>

          {servicoSelecionado && (
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <div className="flex justify-between items-center font-semibold text-text-primary">
                <span>Total</span>
                <span className="text-accent font-serif text-lg">R$ {servicoSelecionado.preco.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Área Principal de Formulário */}
      <div className="flex-1 order-1 md:order-2">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-semibold mb-2 text-text-primary">Escolha o serviço</h3>
                <p className="text-text-secondary">Selecione o serviço que você deseja agendar.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicos.map((servico) => (
                  <button
                    key={(servico as any)._id || servico.id}
                    onClick={() => setFormData({ ...formData, servico: (servico as any)._id || servico.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.servico === ((servico as any)._id || servico.id)
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-border-subtle bg-surface-1 hover:border-border-strong hover:bg-surface-2'
                    }`}
                  >
                    <h4 className="font-semibold text-text-primary mb-1">{servico.nome}</h4>
                    <p className="text-sm text-text-muted flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {servico.duracaoMinutos} min 
                      <span className="opacity-50">•</span> 
                      <span className="font-medium text-text-secondary">R$ {servico.preco.toFixed(2)}</span>
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleNextStep} disabled={!formData.servico} className="gap-2">
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-semibold mb-2 text-text-primary">Escolha o profissional</h3>
                <p className="text-text-secondary">Selecione com quem você quer atendimento.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profissionais.map((profissional) => (
                  <button
                    key={(profissional as any)._id || profissional.id}
                    onClick={() => setFormData({ ...formData, profissional: (profissional as any)._id || profissional.id, horario: '' })}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                      formData.profissional === ((profissional as any)._id || profissional.id)
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-border-subtle bg-surface-1 hover:border-border-strong hover:bg-surface-2'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      formData.profissional === ((profissional as any)._id || profissional.id) ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-text-muted'
                    }`}>
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-text-primary truncate">{profissional.nome}</h4>
                      <p className="text-xs text-text-muted">Especialista</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handlePrevStep} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button onClick={handleNextStep} disabled={!formData.profissional} className="gap-2">
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-semibold mb-2 text-text-primary">Data e Hora</h3>
                <p className="text-text-secondary">Selecione quando você quer vir e preencha seus dados.</p>
              </div>
              
              <div className="bg-surface-1 border border-border-subtle p-4 rounded-xl">
                <CalendarioAgenda selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Horários Disponíveis</h4>
                {formData.profissional ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {horariosDisponiveis.map((horario) => (
                      <button
                        key={horario}
                        onClick={() => setFormData({ ...formData, horario })}
                        className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all ${
                          formData.horario === horario
                            ? 'border-accent bg-accent text-accent-foreground shadow-sm ring-2 ring-accent ring-offset-2 ring-offset-background'
                            : 'border-border-subtle bg-surface-1 text-text-secondary hover:border-border-strong hover:bg-surface-2'
                        }`}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">Volte e escolha um profissional para ver os horários.</p>
                )}
              </div>

              <div className="pt-6 border-t border-border-subtle space-y-4">
                <h4 className="font-medium text-text-primary mb-2">Seus Dados</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Nome completo</label>
                    <Input
                      placeholder="João da Silva"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Telefone (WhatsApp)</label>
                      <Input
                        placeholder="(11) 99999-9999"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">E-mail</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-6">
                <Button variant="ghost" onClick={handlePrevStep} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.horario || !formData.nome || !formData.telefone}>
                  Confirmar Agendamento
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={formVariants} initial="hidden" animate="visible" className="text-center space-y-6 py-16 bg-surface-1 border border-border-subtle rounded-2xl">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center text-status-success">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-serif font-semibold mb-3 text-text-primary">Tudo certo!</h3>
                <p className="text-text-secondary max-w-sm mx-auto">
                  Seu horário está confirmado para <strong className="text-text-primary">{selectedDate.toLocaleDateString('pt-BR')} às {formData.horario}</strong>. 
                  Te esperamos lá!
                </p>
              </div>
              <div className="pt-6">
                <Button variant="outline" onClick={() => {
                  setStep(1);
                  setFormData({ nome: '', telefone: '', email: '', servico: '', profissional: '', horario: '' });
                }}>
                  Fazer outro agendamento
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
