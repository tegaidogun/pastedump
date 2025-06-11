// Constants that can be shared between client and server
export const MAX_CONTENT_LENGTH = 100 * 1024; // 100KB

export type Expiration = "5min" | "1hour" | "1day" | "1week";

// Types
export interface Paste {
  id: string;
  short_id: string;
  title?: string;
  content: string;
  language: string;
  expiration: string;
  view_count: number;
  created_at: string;
  expires_at?: string;
}

export interface PasteInput {
  title?: string;
  content: string;
  expiration: Expiration;
  language: string;
  short_id?: string;
}

// Supported syntax highlighting languages
export const SUPPORTED_LANGUAGES = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'dockerfile', label: 'Dockerfile' },
]; 