import React from 'react';
import { WhatsAppChat } from '@/pages/app/whatsapp/WhatsAppChat';
import { WhatsAppSettings } from '@/pages/app/whatsapp/WhatsAppSettings';

export const WhatsAppPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <WhatsAppChat />
      </div>
      <div className="border-t p-4">
        <WhatsAppSettings />
      </div>
    </div>
  );
};
