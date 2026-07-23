import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Mail, Phone, Calendar } from 'lucide-react';

interface ClienteCardProps {
  nome: string;
  telefone: string;
  email?: string;
  totalAtendimentos: number;
  ultimoAtendimento: string;
  aniversario?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClienteCard: React.FC<ClienteCardProps> = ({
  nome,
  telefone,
  email,
  totalAtendimentos,
  ultimoAtendimento,
  aniversario,
  onEdit,
  onDelete
}) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-surface-1 border border-border-subtle rounded-xl p-5 relative group shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button onClick={onEdit} className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Editar">
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="p-2 rounded-md text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Excluir">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
        <Avatar name={nome} size="lg" />
        <div className="flex-1 pr-0 sm:pr-12 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-text-primary truncate">{nome}</h4>
            {aniversario && <Badge variant="accent" className="flex gap-1 items-center px-2 py-0.5"><Calendar className="w-3 h-3"/> Aniversário</Badge>}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-text-muted truncate flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {telefone}</p>
            {email && <p className="text-sm text-text-muted truncate flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {email}</p>}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm border-t border-border-subtle pt-4 bg-surface-2 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl mt-4">
        <div>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Atendimentos</p>
          <p className="font-semibold text-text-primary font-serif text-lg">{totalAtendimentos}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">Último</p>
          <p className="font-semibold text-text-primary">{ultimoAtendimento}</p>
        </div>
      </div>
    </motion.div>
  );
};
