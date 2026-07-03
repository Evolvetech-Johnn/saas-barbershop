import React from 'react';

interface ChatBubbleProps {
  direction: 'sent' | 'received';
  content: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ direction, content }) => {
  const isSent = direction === 'sent';
  const baseClasses = 'max-w-xs px-3 py-2 rounded-lg break-words';
  const sentClasses = 'bg-tenant-accent text-white self-end';
  const receivedClasses = 'bg-gray-200 text-gray-900 self-start';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`${baseClasses} ${isSent ? sentClasses : receivedClasses}`}>
        {content}
      </div>
    </div>
  );
};
