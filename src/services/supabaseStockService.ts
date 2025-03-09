
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
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
    const { data, error } = await supabase
      .from('bio_stock')
      .select('*')
      .order('symbol', { ascending: true });
    
    if (error) {
      console.error('Error fetching stocks:', error);
      throw new Error(error.message);
    }
    
    return data as Stock[];
  } catch (error) {
    console.error('Failed to fetch stocks:', error);
    throw error;
  }
};

export const addStock = async (stock: Omit<Stock, 'id' | 'last_updated'>): Promise<Stock> => {
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
};

export const updateStock = async (id: string, updates: Partial<Stock>): Promise<void> => {
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
};

export const deleteStock = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('bio_stock')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting stock:', error);
    throw new Error(error.message);
  }
};
