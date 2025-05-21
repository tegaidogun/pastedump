import { NextRequest, NextResponse } from 'next/server';
import { createPaste, calculateExpirationDate, initializeDatabase } from '@/lib/db';

// Initialize database on startup
initializeDatabase();

// POST /api/pastes - Create a new paste
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.content || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Process expiration
    const expirationOption = body.expiration || 'never';
    const expires_at = calculateExpirationDate(expirationOption);
    
    // Create the paste
    const paste = createPaste({
      title: body.title || '',
      content: body.content,
      syntax: body.syntax || 'plain',
      expires_at
    });
    
    // Return the created paste with URL
    return NextResponse.json({
      ...paste,
      url: `/paste/${paste.id}`
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
    const { getRecentPastes } = await import('@/lib/db');
    const pastes = getRecentPastes(5);
    
    return NextResponse.json({
      pastes: pastes.map(paste => ({
        id: paste.id,
        title: paste.title,
        created_at: paste.created_at,
        view_count: paste.view_count,
        syntax: paste.syntax
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