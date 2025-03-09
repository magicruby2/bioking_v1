
import PostgresService from './postgresService';
import { ChatMessage, ChatSession } from '@/components/chat/ChatSessionContext';

// This service handles chat operations with PostgreSQL
export class ChatDbService {
  // Get all sessions
  public static async getSessions(): Promise<ChatSession[]> {
    try {
      const dbSessions = await PostgresService.getInstance().getSessions();
      
      // For each session, fetch its messages
      const sessions: ChatSession[] = [];
      for (const session of dbSessions) {
        const messages = await PostgresService.getInstance().getSessionMessages(session.id);
        sessions.push({
          ...session,
          messages
        });
      }
      
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }
  
  // Save a session with its messages
  public static async saveSession(session: ChatSession): Promise<void> {
    try {
      // Save the session first
      await PostgresService.getInstance().saveSession({
        id: session.id,
        title: session.title,
        preview: session.preview,
        createdAt: session.createdAt
      });
      
      // Then save all messages
      await PostgresService.getInstance().saveMessages(session.id, session.messages);
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }
  
  // Delete a session
  public static async deleteSession(sessionId: string): Promise<void> {
    try {
      await PostgresService.getInstance().deleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
  
  // Delete all sessions
  public static async deleteAllSessions(): Promise<void> {
    try {
      await PostgresService.getInstance().deleteAllSessions();
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw error;
    }
  }
  
  // Process a chat message and get a response
  public static async processMessage(message: string): Promise<string> {
    try {
      // This is where you'd integrate with your AI model or service
      // For now, we'll just return a simple response
      return `I received your message: "${message}". This is a local PostgreSQL response.`;
    } catch (error) {
      console.error('Error processing message:', error);
      return "Sorry, I couldn't process your message.";
    }
  }
}

export default ChatDbService;
