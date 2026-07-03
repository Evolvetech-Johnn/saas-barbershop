import React from 'react';

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-2 items-center border-t p-2">
      <input
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tenant-accent"
        type="text"
        placeholder="Digite sua mensagem..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="bg-tenant-accent text-white rounded px-4 py-2 hover:opacity-90"
        onClick={onSend}
      >
        Enviar
      </button>
    </div>
  );
};
