// "use client";

import { supabaseAdmin } from './supabaseClient';
import { Paste, MAX_CONTENT_LENGTH } from './constants';

// Generate a short ID (6 characters alphanumeric)
function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return id;
}

// Create a new paste
export async function createPaste(
  paste: Omit<Paste, 'id' | 'created_at' | 'view_count' | 'expiration'> & {
    expiration: string;
    short_id?: string;
  }
): Promise<Paste> {
  let short_id = paste.short_id;

  // If no short_id is provided, generate one until we find one that is not in use
  if (!short_id) {
    let isUnique = false;
    while (!isUnique) {
      short_id = generateShortId();
      const { data, error } = await supabaseAdmin.from('pastes').select('id').eq('short_id', short_id);
      if (error) throw error;
      if (data.length === 0) {
        isUnique = true;
      }
    }
  }

  let content = paste.content;
  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.substring(0, MAX_CONTENT_LENGTH);
  }

  const expirationDate = calculateExpirationDate(paste.expiration);

  const { data: newPaste, error } = await supabaseAdmin
    .from('pastes')
    .insert({
      short_id,
      title: paste.title || 'Untitled paste',
      content,
      language: paste.language || 'plain',
      expiration: expirationDate,
      author: paste.author,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating paste in Supabase:', error);
    throw error;
  }

  return newPaste as Paste;
}

// Get a paste by short_id
export async function getPaste(short_id: string): Promise<Paste | null> {
  const { data, error } = await supabaseAdmin
    .from('pastes')
    .select('*')
    .eq('short_id', short_id)
    .gt('expiration', new Date().toISOString())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = 0 rows
    console.error('Error fetching paste from Supabase:', error);
  }

  return data;
}

// Increment view count for a paste
export async function incrementViewCount(short_id: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_view_count', {
    paste_short_id: short_id,
  });
  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

// Get recent pastes
export async function getRecentPastes(limit = 5): Promise<Paste[]> {
  const { data, error } = await supabaseAdmin
    .from('pastes')
    .select('*')
    .gt('expiration', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
      console.error('Error fetching recent pastes from Supabase:', error);
      return [];
  }
  return data || [];
}

// Search pastes by content, title, or ID
export async function searchPastes(
  query: string,
  page = 1,
  perPage = 20
): Promise<{ results: Paste[]; total: number }> {
    const offset = (page - 1) * perPage;

    // First try exact ID match
    const exactMatch = await getPaste(query);
    if(exactMatch) {
        return { results: [exactMatch], total: 1 };
    }

    // Then search text
    const { data, error, count } = await supabaseAdmin
        .from('pastes')
        .select('*', { count: 'exact' })
        .textSearch('content', `'${query}'`)
        .gt('expiration', new Date().toISOString())
        .order('created_at', { ascending: false })
        .range(offset, offset + perPage - 1);

    if (error) {
        console.error('Error searching pastes in Supabase:', error);
        return { results: [], total: 0 };
    }

    return {
        results: data || [],
        total: count || 0,
    };
}

// Calculate expiration date based on expiration option
export function calculateExpirationDate(expiration: string): string {
    const now = new Date();
  
    switch (expiration) {
      case '5min':
        return new Date(now.getTime() + 5 * 60 * 1000).toISOString();
      case '1hour':
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      case '1day':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case '1week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      default:
        // Default to 1 week if no expiration is specified
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  } 