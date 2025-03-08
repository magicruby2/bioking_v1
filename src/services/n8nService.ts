
interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export type WebhookType = 'chat' | 'stocks' | 'news';

const N8N_BASE_URL = 'https://naldu.app.n8n.cloud/webhook-test';

/**
 * Service for handling n8n webhook integrations
 */
export class N8nService {
  private static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }
  
  private static instance: N8nService;
  
  private constructor() {}
  
  /**
   * Gets the appropriate webhook URL for the given type
   */
  private getWebhookUrl(type: WebhookType): string {
    const endpoints = {
      chat: 'a74ca145-c884-4c43-8794-7b70ed9e34fb',
      stocks: '2', 
      news: '3'
    };
    
    return `${N8N_BASE_URL}/${endpoints[type]}`;
  }
  
  /**
   * Sends a request to the n8n webhook
   */
  private async sendWebhookRequest(
    type: WebhookType,
    payload: any,
    method: 'GET' | 'POST' = 'POST'
  ): Promise<WebhookResponse> {
    try {
      console.log(`Sending ${type} webhook request:`, payload);
      
      let url = this.getWebhookUrl(type);
      let options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      // For GET requests, convert payload to query parameters
      if (method === 'GET' && payload) {
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        url = `${url}?${queryParams.toString()}`;
      } else {
        // For POST requests, add the payload to the body
        options.body = JSON.stringify(payload);
      }
      
      const response = await fetch(url, options);
      
      const data = await response.json();
      console.log(`${type} webhook response:`, data);
      
      return {
        success: response.ok,
        data
      };
    } catch (error) {
      console.error(`Error in ${type} webhook:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // --- Public API ---
  
  /**
   * Sends a chat message to the n8n webhook
   */
  public static async sendChatMessage(message: string): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('chat', { message }, 'GET');
  }
  
  /**
   * Fetches stock data via the n8n webhook
   */
  public static async fetchStockData(symbol: string, timeframe: string): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('stocks', { symbol, timeframe });
  }
  
  /**
   * Fetches news data via the n8n webhook
   */
  public static async fetchNewsData(category: string, count: number): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('news', { category, count });
  }
}

export default N8nService;
