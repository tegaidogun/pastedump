import { NextRequest, NextResponse } from 'next/server';
import { searchPastes } from '@/lib/db';

// GET /api/pastes/search - Search pastes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '20', 10);
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const { results, total } = await searchPastes(query, page, perPage);
    
    return NextResponse.json({
      results: results.map(paste => ({
        id: paste.short_id,
        title: paste.title,
        created_at: paste.created_at,
        view_count: paste.view_count
      })),
      total,
      page,
      per_page: perPage
    });
    
  } catch (error) {
    console.error('Error searching pastes:', error);
    return NextResponse.json(
      { error: 'Failed to search pastes' },
      { status: 500 }
    );
  }
} 