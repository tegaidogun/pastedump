import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    
    const DATA_DIR = path.join(process.cwd(), 'data');
    const PASTES_DIR = path.join(DATA_DIR, 'pastes');
    const filePath = path.join(PASTES_DIR, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }
    
    const pasteData = fs.readFileSync(filePath, 'utf-8');
    const paste = JSON.parse(pasteData);
    
    // Increment view count
    paste.view_count += 1;
    fs.writeFileSync(filePath, JSON.stringify(paste, null, 2));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(`Error incrementing view count for ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
} 