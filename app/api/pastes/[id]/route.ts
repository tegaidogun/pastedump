import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/db';

// GET /api/pastes/[id] - Get a single paste
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const paste = await getPaste(id);
    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    return NextResponse.json(paste);
  } catch (error) {
    console.error(`Error fetching paste for an unknown ID:`, error);
    return NextResponse.json({ error: 'Failed to fetch paste' }, { status: 500 });
  }
} 