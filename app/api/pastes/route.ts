import { NextRequest, NextResponse } from 'next/server';
import { createPaste, getRecentPastes } from '@/lib/db';
import { z } from 'zod';
import { Expiration } from '@/lib/constants';

const pasteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  language: z.string().default('plain'),
  expiration: z.custom<Expiration>(),
  short_id: z.string().optional(),
});

// POST /api/pastes - Create a new paste
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = pasteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    // Create the paste
    const paste = await createPaste(validation.data);
    
    // Return the created paste with URL
    return NextResponse.json({
      ...paste,
      url: `/paste/${paste.short_id}`
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { status: 500 }
    );
  }
}

// GET /api/pastes - Get recent pastes
export async function GET() {
  try {
    const pastes = await getRecentPastes();
    
    return NextResponse.json({
      pastes: pastes.map(paste => ({
        id: paste.short_id,
        title: paste.title,
        created_at: paste.created_at,
        view_count: paste.view_count,
        language: paste.language
      }))
    });
    
  } catch (error) {
    console.error('Error fetching recent pastes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent pastes' },
      { status: 500 }
    );
  }
} 