// "use client";

import { supabase, supabaseAdmin } from './supabaseClient';
import { Paste, PasteInput, Expiration } from './constants';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateShortId(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
}

export async function createPaste(paste: PasteInput): Promise<Paste> {
  let shortId = paste.short_id;
  
  if (!shortId) {
    let isUnique = false;
    while (!isUnique) {
      const generatedId = generateShortId(6);
      const { data, error } = await supabaseAdmin
        .from('pastes')
        .select('id')
        .eq('short_id', generatedId)
        .single();

      if (!data && (error?.code === 'PGRST116' || !error)) {
        isUnique = true;
        shortId = generatedId;
      } else if (error) {
        throw new Error('Failed to check for unique short_id: ' + error.message);
      }
    }
  }

  const expirationDate = getExpirationDate(paste.expiration);

  const { data, error } = await supabaseAdmin
    .from('pastes')
    .insert({
      ...paste,
      short_id: shortId,
      expiration: expirationDate.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating paste:', error);
    throw new Error('Failed to create paste: ' + error.message);
  }

  return data as Paste;
}

export async function getPaste(shortId: string): Promise<Paste | null> {
  const { data, error } = await supabase
    .from('pastes')
    .select('*')
    .eq('short_id', shortId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching paste ${shortId}:`, error);
    return null;
  }
  
  return data || null;
}

export async function incrementViewCount(shortId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_view_count', {
    paste_short_id: shortId,
  });

  if (error) {
    console.error(`Failed to increment view count for ${shortId}:`, error);
    throw new Error(error.message);
  }
}

export async function getRecentPastes(): Promise<Paste[]> {
  const { data, error } = await supabaseAdmin
    .from('pastes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recent pastes:', error);
    return [];
  }
  return data || [];
}

export async function searchPastes(query: string, page = 1, pageSize = 20) {
  const idMatch = await supabaseAdmin
    .from('pastes')
    .select('*')
    .eq('short_id', query)
    .limit(1)
    .single();

  if (idMatch.data) {
    return { data: [idMatch.data], count: 1 };
  }
  
  const searchResult = await supabaseAdmin
    .from('pastes')
    .select('*', { count: 'exact' })
    .textSearch('fts', query, {
      type: 'websearch',
      config: 'english',
    })
    .range((page - 1) * pageSize, page * pageSize - 1);

  return searchResult;
}

function getExpirationDate(expiration: Expiration): Date {
  const now = new Date();
  switch (expiration) {
    case '5min':
      return new Date(now.getTime() + 5 * 60 * 1000);
    case '1hour':
      return new Date(now.getTime() + 60 * 60 * 1000);
    case '1day':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '1week':
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
} 