
import { createClient } from '@supabase/supabase-js';

// This is just an example - in a real implementation, we would use the Supabase client from the integration
const mockSupabaseClient = {
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        data: null,
        error: null,
      }),
    }),
    insert: () => ({
      data: null,
      error: null,
    }),
    update: () => ({
      data: null, 
      error: null,
    }),
    delete: () => ({
      match: () => ({
        data: null,
        error: null,
      }),
    }),
  }),
};

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  change_percent: number;
  last_updated: string;
}

export const fetchStocks = async (): Promise<Stock[]> => {
  // TODO: Replace with actual Supabase client once integration is set up
  const supabase = mockSupabaseClient;
  
  // In a real implementation, we would fetch from Supabase like this:
  // const { data, error } = await supabase
  //   .from('stocks')
  //   .select('*')
  //   .order('symbol', { ascending: true });
  
  // if (error) {
  //   console.error('Error fetching stocks:', error);
  //   throw new Error(error.message);
  // }
  
  // return data as Stock[];
  
  // For now, return mock data
  return [
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.', current_price: 172.40, change_percent: 0.8, last_updated: new Date().toISOString() },
    { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', current_price: 339.31, change_percent: 1.2, last_updated: new Date().toISOString() },
    { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', current_price: 139.80, change_percent: -0.5, last_updated: new Date().toISOString() },
    { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', current_price: 123.20, change_percent: 2.1, last_updated: new Date().toISOString() },
    { id: '5', symbol: 'META', name: 'Meta Platforms Inc.', current_price: 308.65, change_percent: 1.7, last_updated: new Date().toISOString() },
    { id: '6', symbol: 'TSLA', name: 'Tesla Inc.', current_price: 274.39, change_percent: -1.3, last_updated: new Date().toISOString() },
    { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', current_price: 431.60, change_percent: 3.2, last_updated: new Date().toISOString() },
  ];
};

export const addStock = async (stock: Omit<Stock, 'id' | 'last_updated'>): Promise<Stock> => {
  // TODO: Implement with actual Supabase client once integration is set up
  console.log('Adding stock:', stock);
  
  // Mock implementation
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...stock,
    last_updated: new Date().toISOString(),
  };
};

export const updateStock = async (id: string, updates: Partial<Stock>): Promise<void> => {
  // TODO: Implement with actual Supabase client once integration is set up
  console.log('Updating stock:', id, updates);
};

export const deleteStock = async (id: string): Promise<void> => {
  // TODO: Implement with actual Supabase client once integration is set up
  console.log('Deleting stock:', id);
};
