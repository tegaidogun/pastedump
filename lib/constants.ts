// Constants that can be shared between client and server
export const MAX_CONTENT_LENGTH = 100 * 1024; // 100KB

// Types
export interface Paste {
  id: string;
  title: string;
  content: string;
  syntax: string;
  created_at: string;
  expires_at: string | null;
  view_count: number;
} 