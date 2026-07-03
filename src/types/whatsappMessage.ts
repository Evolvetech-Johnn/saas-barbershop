export type Direction = 'sent' | 'received';

export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  direction: Direction;
  content: string;
  timestamp: Date;
  // future extensions: mediaUrl?: string;
}
