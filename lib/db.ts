// "use client";

import { sql } from '@vercel/postgres';
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
      const { rows } = await sql`SELECT id FROM pastes WHERE short_id = ${short_id}`;
      if (rows.length === 0) {
        isUnique = true;
      }
    }
  }

  let content = paste.content;
  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.substring(0, MAX_CONTENT_LENGTH);
  }

  const expirationDate = calculateExpirationDate(paste.expiration);

  const result = await sql`
    INSERT INTO pastes (short_id, title, content, language, expiration, author)
    VALUES (${short_id}, ${paste.title || 'Untitled paste'}, ${content}, ${
    paste.language || 'plain'
  }, ${expirationDate}, ${paste.author})
    RETURNING id, short_id, title, content, language, created_at, expiration, view_count, author;
  `;

  return result.rows[0] as Paste;
}

// Get a paste by short_id
export async function getPaste(short_id: string): Promise<Paste | null> {
  const { rows } = await sql`
    SELECT id, short_id, title, content, language, created_at, expiration, view_count, author 
    FROM pastes 
    WHERE short_id = ${short_id} AND expiration > NOW()
  `;

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Paste;
}

// Increment view count for a paste
export async function incrementViewCount(short_id: string): Promise<void> {
    await sql`UPDATE pastes SET view_count = view_count + 1 WHERE short_id = ${short_id}`;
}

// Get recent pastes
export async function getRecentPastes(limit = 5): Promise<Paste[]> {
  const { rows } = await sql`
    SELECT id, short_id, title, content, language, created_at, expiration, view_count, author 
    FROM pastes 
    WHERE expiration > NOW()
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
  return rows as Paste[];
}

// Search pastes by content, title, or ID
export async function searchPastes(
  query: string,
  page = 1,
  perPage = 20
): Promise<{ results: Paste[]; total: number }> {
  const offset = (page - 1) * perPage;
  const queryLower = `%${query.toLowerCase()}%`;

  // First, try exact ID match
  const { rows: exactMatch } = await sql`
    SELECT id, short_id, title, content, language, created_at, expiration, view_count, author 
    FROM pastes 
    WHERE short_id = ${query} AND expiration > NOW()
  `;

  if (exactMatch.length > 0) {
    return { results: exactMatch as Paste[], total: 1 };
  }

  // Then search content and title
  const { rows: searchResults } = await sql`
    SELECT id, short_id, title, content, language, created_at, expiration, view_count, author 
    FROM pastes 
    WHERE (LOWER(title) LIKE ${queryLower} OR LOWER(content) LIKE ${queryLower}) AND expiration > NOW()
    ORDER BY created_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `;

  const { rows: totalRows } = await sql`
    SELECT COUNT(*) as total
    FROM pastes
    WHERE (LOWER(title) LIKE ${queryLower} OR LOWER(content) LIKE ${queryLower}) AND expiration > NOW()
  `;
  
  const total = totalRows[0].total as number;

  return {
    results: searchResults as Paste[],
    total,
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