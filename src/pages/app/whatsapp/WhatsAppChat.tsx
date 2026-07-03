import React, { useEffect, useState } from 'react';
import { useWhatsApp } from '@/context/WhatsAppContext';
import { ChatBubble } from '@/components/ui/ChatBubble';
import { MessageInput } from '@/components/ui/MessageInput';

export const WhatsAppChat: React.FC = () => {
  const { messages, sendMessage } = useWhatsApp();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    sendMessage(input.trim(), 'sent');
    setInput('');
  };

  // Simulate automatic reply (mock)
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.direction === 'sent') {
      const timeout = setTimeout(() => {
        sendMessage('Obrigado! Entraremos em contato em breve.', 'received');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [messages, sendMessage]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} direction={msg.direction} content={msg.content} />
        ))}
      </div>
      <MessageInput value={input} onChange={setInput} onSend={handleSend} />
    </div>
  );
};
