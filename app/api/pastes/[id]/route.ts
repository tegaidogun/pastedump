import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/db';

// GET /api/pastes/[id] - Get a paste by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Paste ID is required' },
        { status: 400 }
      );
    }
    
    const paste = await getPaste(id);
    
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(paste);
    
  } catch (error) {
    console.error(`Error fetching paste ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { status: 500 }
    );
  }
} 