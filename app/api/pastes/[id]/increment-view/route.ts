import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount, getPaste } from '@/lib/db';

// POST /api/pastes/[id]/increment-view - Increment view count once
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Check if paste exists before incrementing
    const paste = await getPaste(id);
    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }
    
    await incrementViewCount(id);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(`Error incrementing view count for ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
} 