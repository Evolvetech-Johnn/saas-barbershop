import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { WhatsAppMessage } from '@/types/whatsappMessage';
import { sendMessage as mockSendMessage, fetchHistory } from '@/services/whatsappService';
import { useToast } from '@/context/ToastContext';

interface WhatsAppContextType {
  messages: WhatsAppMessage[];
  sendMessage: (content: string, direction?: 'sent' | 'received') => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const { addToast } = useToast();

  // Ref to avoid stale closures without re-registering effects
  const addToastRef = useRef(addToast);
  useEffect(() => {
    addToastRef.current = addToast;
  }, [addToast]);

  // Load history on mount
  useEffect(() => {
    const history = fetchHistory();
    setMessages(history);
  }, []);

  const sendMessage = (content: string, direction: 'sent' | 'received' = 'sent') => {
    const msg: WhatsAppMessage = {
      id: Date.now().toString(),
      tenantId: 'current',
      direction,
      content,
      timestamp: new Date(),
    };
    mockSendMessage(msg);
    setMessages((prev) => [...prev, msg]);
    if (direction === 'sent') {
      addToastRef.current('Mensagem enviada via WhatsApp mock', 'info');
    }
  };

  return (
    <WhatsAppContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) throw new Error('useWhatsApp must be used within WhatsAppProvider');
  return ctx;
};
