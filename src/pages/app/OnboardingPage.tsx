import React, { useState } from 'react'
import { useTenant } from '@/context/TenantContext'
import { useToast } from '@/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { generateSlug } from '@/utils/slug'

const OnboardingPage: React.FC = () => {
  const { availableTenants, setTenant, updateTenant, tenant } = useTenant()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: tenant?.nome || '',
    slug: tenant?.slug || '',
    corAcento: tenant?.corAcento || '#d4af37',
    descricaoPublica: tenant?.descricaoPublica || '',
    endereco: tenant?.endereco || '',
    telefone: tenant?.telefone || '',
    horarioFuncionamento: tenant?.horarioFuncionamento || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'nome' && { slug: generateSlug(value) })
    }))
  }

  const handleNextStep = () => {
    if (step === 1 && !formData.nome) {
      addToast('Por favor, informe o nome da barbearia', 'warning')
      return
    }
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await updateTenant({
      nome: formData.nome,
      slug: formData.slug,
      corAcento: formData.corAcento,
      descricaoPublica: formData.descricaoPublica,
      endereco: formData.endereco,
      telefone: formData.telefone,
      horarioFuncionamento: formData.horarioFuncionamento,
      onboardingConcluido: true,
    })
    
    addToast('Onboarding concluído com sucesso!', 'success')
    navigate('/app/dashboard')
  }

  const handleSelectExistingTenant = async (tenantId: string) => {
    const selectedTenant = availableTenants.find(t => t.id === tenantId)
    if (selectedTenant) {
      setTenant(selectedTenant)
      addToast(`Bem-vindo(a) de volta à ${selectedTenant.nome}!`, 'success')
      navigate('/app/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Bem-vindo(a)!</h1>
          <p className="text-support-300">Vamos configurar sua barbearia</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map(num => (
              <React.Fragment key={num}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    num < step
                      ? 'bg-[var(--tenant-accent)] text-base-950'
                      : num === step
                      ? 'bg-[var(--tenant-accent)] text-base-950'
                      : 'bg-base-800 text-support-300'
                  }`}
                >
                  {num < step ? '✓' : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      num < step ? 'bg-[var(--tenant-accent)]' : 'bg-base-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-support-300">
            <span className="w-10 text-center">Dados Básicos</span>
            <span className="w-16 text-center">Informações Públicas</span>
            <span className="w-10 text-center">Concluir</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Escolha uma barbearia existente ou crie uma nova
              </label>
              <div className="space-y-3">
                {availableTenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectExistingTenant(t.id)}
                    className="w-full p-4 rounded-lg border border-base-800 bg-base-900 hover:bg-base-800 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-support-300">{t.nome}</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: t.corAcento }}
                      />
                    </div>
                  </button>
                ))}
              </div>
              <div className="my-4 text-center text-sm text-support-300">ou</div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-support-200 mb-2">
                  Nome da Barbearia
                </label>
                <Input
                  name="nome"
                  placeholder="Ex: Barbearia Classic"
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm text-support-200 mb-2">
                  Slug (URL pública)
                </label>
                <Input
                  name="slug"
                  placeholder="ex: barbearia-classic"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm text-support-200 mb-2">
                  Cor de Acento
                </label>
                <div className="flex gap-3">
                  {['#d4af37', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, corAcento: color }))}
                      className={`w-10 h-10 rounded-full border-2 ${
                        formData.corAcento === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNextStep}>Próximo</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Descrição Pública
              </label>
              <textarea
                name="descricaoPublica"
                placeholder="Descreva sua barbearia..."
                value={formData.descricaoPublica}
                onChange={handleInputChange}
                className="w-full bg-base-900 border border-base-800 rounded-lg p-3 text-support-100 focus:outline-none focus:border-[var(--tenant-accent)] h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Endereço
              </label>
              <Input
                name="endereco"
                placeholder="Rua das Flores, 123 - Centro"
                value={formData.endereco}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Telefone
              </label>
              <Input
                name="telefone"
                placeholder="(11) 98765-4321"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Horário de Funcionamento
              </label>
              <Input
                name="horarioFuncionamento"
                placeholder="Seg-Sex: 9h-19h | Sáb: 9h-17h"
                value={formData.horarioFuncionamento}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button onClick={handleNextStep}>Próximo</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="text-5xl">🎉</div>
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2">
                Pronto!
              </h2>
              <p className="text-support-300">
                Sua barbearia está configurada. Vamos começar!
              </p>
            </div>
            <div className="p-6 bg-base-900 rounded-lg border border-base-800">
              <h3 className="font-semibold mb-2">{formData.nome}</h3>
              <p className="text-sm text-support-300">{formData.slug}</p>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep}>
                Voltar
              </Button>
              <Button onClick={handleSubmit}>Ir para o Dashboard</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default OnboardingPage
