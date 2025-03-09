
import { Pool, PoolClient } from 'pg';

// This service handles PostgreSQL database connections and operations
export class PostgresService {
  private static instance: PostgresService;
  private pool: Pool;
  
  private constructor() {
    // Create a connection pool
    this.pool = new Pool({
      host: import.meta.env.VITE_PG_HOST || 'localhost',
      port: parseInt(import.meta.env.VITE_PG_PORT || '5432'),
      database: import.meta.env.VITE_PG_DATABASE || 'chatapp',
      user: import.meta.env.VITE_PG_USER || 'postgres',
      password: import.meta.env.VITE_PG_PASSWORD || 'postgres',
    });
    
    // Log connection errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
    
    console.log('PostgreSQL service initialized');
  }
  
  public static getInstance(): PostgresService {
    if (!PostgresService.instance) {
      PostgresService.instance = new PostgresService();
    }
    return PostgresService.instance;
  }
  
  /**
   * Get a client from the pool
   */
  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }
  
  /**
   * Execute a query and return results
   */
  public async query(text: string, params: any[] = []): Promise<any> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('PostgreSQL query executed', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error executing query', { text, error });
      throw error;
    }
  }
  
  /**
   * Initialize the database with required tables
   */
  public async initializeDatabase(): Promise<void> {
    try {
      // Create sessions table if it doesn't exist
      await this.query(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          preview TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create messages table if it doesn't exist
      await this.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(255) PRIMARY KEY,
          session_id VARCHAR(255) REFERENCES chat_sessions(id) ON DELETE CASCADE,
          role VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Database initialized with required tables');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
  
  /**
   * Save a chat session to the database
   */
  public async saveSession(session: {
    id: string;
    title: string;
    preview: string;
    createdAt: string;
  }): Promise<void> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Insert or update the session
      await client.query(
        `INSERT INTO chat_sessions (id, title, preview, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE
         SET title = $2, preview = $3`,
        [session.id, session.title, session.preview, new Date(session.createdAt)]
      );
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error saving session:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Save chat messages to the database
   */
  public async saveMessages(sessionId: string, messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>): Promise<void> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Delete existing messages for this session (optional - depends on your strategy)
      await client.query('DELETE FROM chat_messages WHERE session_id = $1', [sessionId]);
      
      // Insert all messages
      for (const message of messages) {
        await client.query(
          `INSERT INTO chat_messages (id, session_id, role, content, timestamp)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE
           SET content = $4`,
          [
            message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            message.role,
            message.content,
            message.timestamp ? new Date(message.timestamp) : new Date()
          ]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error saving messages:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Get all sessions from the database
   */
  public async getSessions(): Promise<Array<{
    id: string;
    title: string;
    preview: string;
    createdAt: string;
  }>> {
    try {
      const result = await this.query(`
        SELECT id, title, preview, created_at
        FROM chat_sessions
        ORDER BY created_at DESC
      `);
      
      return result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        preview: row.preview,
        createdAt: row.created_at.toISOString()
      }));
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw error;
    }
  }
  
  /**
   * Get messages for a session
   */
  public async getSessionMessages(sessionId: string): Promise<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>> {
    try {
      const result = await this.query(`
        SELECT id, role, content, timestamp
        FROM chat_messages
        WHERE session_id = $1
        ORDER BY timestamp ASC
      `, [sessionId]);
      
      return result.rows.map((row: any) => ({
        id: row.id,
        role: row.role as 'user' | 'assistant',
        content: row.content,
        timestamp: row.timestamp.toISOString()
      }));
    } catch (error) {
      console.error('Error getting session messages:', error);
      throw error;
    }
  }
  
  /**
   * Delete a session and its messages
   */
  public async deleteSession(sessionId: string): Promise<void> {
    try {
      // Due to foreign key constraints with CASCADE, we only need to delete the session
      await this.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
  
  /**
   * Delete all sessions and messages
   */
  public async deleteAllSessions(): Promise<void> {
    try {
      await this.query('DELETE FROM chat_sessions');
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw error;
    }
  }
}

export default PostgresService;
