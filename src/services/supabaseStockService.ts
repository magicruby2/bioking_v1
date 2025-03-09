
import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for interacting with your database
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  change_percent: number;
  last_updated: string;
}

export const fetchStocks = async (): Promise<Stock[]> => {
  try {
    console.log('Fetching stocks from bio_stock schema...');
    
    const { data, error } = await supabase
      .from('bio_stock')
      .select('*')
      .order('symbol', { ascending: true });
    
    if (error) {
      console.error('Error fetching stocks:', error);
      throw new Error(error.message);
    }
    
    console.log('Fetched stocks:', data);
    return data as Stock[];
  } catch (error) {
    console.error('Exception fetching stocks:', error);
    // Return empty array instead of throwing to prevent white screen
    return [];
  }
};

export const addStock = async (stock: Omit<Stock, 'id' | 'last_updated'>): Promise<Stock> => {
  try {
    const newStock = {
      ...stock,
      last_updated: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('bio_stock')
      .insert([newStock])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding stock:', error);
      throw new Error(error.message);
    }
    
    return data as Stock;
  } catch (error) {
    console.error('Exception adding stock:', error);
    throw error;
  }
};

export const updateStock = async (id: string, updates: Partial<Stock>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bio_stock')
      .update({
        ...updates,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating stock:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Exception updating stock:', error);
    throw error;
  }
};

export const deleteStock = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bio_stock')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting stock:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Exception deleting stock:', error);
    throw error;
  }
};
