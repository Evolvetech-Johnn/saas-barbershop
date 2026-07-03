import { WhatsAppMessage } from '@/types/whatsappMessage';

const STORAGE_KEY = 'whatsapp_history';

export const fetchHistory = (): WhatsAppMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WhatsAppMessage[];
    // revive dates
    return parsed.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (e) {
    console.error('Failed to load WhatsApp history', e);
    return [];
  }
};

export const sendMessage = (msg: WhatsAppMessage) => {
  const history = fetchHistory();
  const updated = [...history, msg];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist WhatsApp message', e);
  }
};
