import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/db';

// GET /api/pastes/[id]/raw - Get raw content of a paste
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new Response('ID required', { status: 400 });
    }

    const paste = await getPaste(id);
    if (!paste) {
      return new Response('Paste not found', { status: 404 });
    }
    
    return new Response(paste.content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error(`Error fetching raw paste for an unknown ID:`, error);
    return new Response('Failed to fetch raw paste', { status: 500 });
  }
} 