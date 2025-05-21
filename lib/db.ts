// "use client";

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Paste, MAX_CONTENT_LENGTH } from './constants';

const DATA_DIR = path.join(process.cwd(), 'data');
const PASTES_DIR = path.join(DATA_DIR, 'pastes');

// Generate a short ID (6 characters alphanumeric)
function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Check if ID already exists
  const filePath = path.join(PASTES_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    // If ID exists, generate a new one recursively
    return generateShortId();
  }
  
  return id;
}

// Ensure the data directories exist
export function initializeDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
  
  if (!fs.existsSync(PASTES_DIR)) {
    fs.mkdirSync(PASTES_DIR);
  }
}

// Create a new paste
export function createPaste(paste: Omit<Paste, 'id' | 'created_at' | 'view_count'>): Paste {
  // Use short ID instead of UUID
  const id = generateShortId();
  const created_at = new Date().toISOString();
  
  // Trim content if it exceeds maximum length
  let content = paste.content;
  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.substring(0, MAX_CONTENT_LENGTH);
  }
  
  const newPaste: Paste = {
    id,
    title: paste.title || 'Untitled paste',
    content,
    syntax: paste.syntax || 'plain',
    created_at,
    expires_at: paste.expires_at,
    view_count: 0
  };
  
  const filePath = path.join(PASTES_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(newPaste, null, 2));
  
  return newPaste;
}

// Get a paste by ID
export function getPaste(id: string): Paste | null {
  const filePath = path.join(PASTES_DIR, `${id}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const pasteData = fs.readFileSync(filePath, 'utf-8');
  const paste = JSON.parse(pasteData) as Paste;
  
  // Check if paste has expired
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    // Delete expired paste
    fs.unlinkSync(filePath);
    return null;
  }
  
  // No longer incrementing view count here
  return paste;
}

// Get recent pastes
export function getRecentPastes(limit = 5): Paste[] {
  initializeDatabase();
  
  if (!fs.existsSync(PASTES_DIR)) {
    return [];
  }
  
  const files = fs.readdirSync(PASTES_DIR)
    .filter(file => file.endsWith('.json'));
  
  const pastes: Paste[] = [];
  
  for (const file of files) {
    const filePath = path.join(PASTES_DIR, file);
    const pasteData = fs.readFileSync(filePath, 'utf-8');
    const paste = JSON.parse(pasteData) as Paste;
    
    // Skip expired pastes
    if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
      fs.unlinkSync(filePath);
      continue;
    }
    
    pastes.push(paste);
  }
  
  // Sort by creation date (newest first) and limit
  return pastes
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

// Search pastes by content, title, or ID
export function searchPastes(query: string, page = 1, perPage = 20): { results: Paste[], total: number } {
  initializeDatabase();
  
  if (!fs.existsSync(PASTES_DIR)) {
    return { results: [], total: 0 };
  }
  
  const files = fs.readdirSync(PASTES_DIR)
    .filter(file => file.endsWith('.json'));
  
  const matchingPastes: Paste[] = [];
  const queryLower = query.toLowerCase();
  
  // First, try exact ID match (prioritize this)
  if (query.length <= 6) {
    const exactIdFile = `${query}.json`;
    if (files.includes(exactIdFile)) {
      const filePath = path.join(PASTES_DIR, exactIdFile);
      const pasteData = fs.readFileSync(filePath, 'utf-8');
      const paste = JSON.parse(pasteData) as Paste;
      
      // Skip if paste has expired
      if (!(paste.expires_at && new Date(paste.expires_at) < new Date())) {
        return { 
          results: [paste], 
          total: 1 
        };
      }
    }
  }
  
  // Then do the regular search
  for (const file of files) {
    const filePath = path.join(PASTES_DIR, file);
    const pasteData = fs.readFileSync(filePath, 'utf-8');
    const paste = JSON.parse(pasteData) as Paste;
    
    // Skip expired pastes
    if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
      fs.unlinkSync(filePath);
      continue;
    }
    
    // Check if query matches title, content, or ID
    if (paste.id.toLowerCase().includes(queryLower) || 
        paste.title.toLowerCase().includes(queryLower) ||
        paste.content.toLowerCase().includes(queryLower)) {
      matchingPastes.push(paste);
    }
  }
  
  const sortedPastes = matchingPastes.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedResults = sortedPastes.slice(start, end);
  
  return {
    results: paginatedResults,
    total: matchingPastes.length
  };
}

// Calculate expiration date based on expiration option
export function calculateExpirationDate(expiration: string): string | null {
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