
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatHistory {
  messages: Message[];
  lastUpdated: Date;
}
