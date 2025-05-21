import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/db';

// GET /api/pastes/[id]/raw - Get the raw content of a paste
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response('Paste ID is required', { status: 400 });
    }
    
    const paste = getPaste(id);
    
    if (!paste) {
      return new Response('Paste not found', { status: 404 });
    }
    
    // Return plain text response
    return new Response(paste.content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `inline; filename="${id}.txt"`
      }
    });
    
  } catch (error) {
    console.error(`Error fetching raw paste ${params.id}:`, error);
    return new Response('Failed to fetch paste', { status: 500 });
  }
} 