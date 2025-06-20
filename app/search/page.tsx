import SearchForm from "@/components/search-form"
import SearchResults from "@/components/search-results"
import { searchPastes } from "@/lib/db"
import { Paste } from "@/lib/constants"

export interface SearchResultItem {
  id: string;
  title: string;
  created_at: string;
  view_count: number;
}

export interface SearchResultsData {
  results: SearchResultItem[];
  total: number;
  query: string;
  page: number;
  perPage: number;
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 20;

  let searchResults: SearchResultsData = {
    results: [],
    total: 0,
    query,
    page,
    perPage
  };

  if (query) {
    const { results, total } = await searchPastes(query, page, perPage);
    searchResults.results = results.map(p => ({
      id: p.short_id as string,
      title: p.title,
      created_at: p.created_at,
      view_count: p.view_count,
    }));
    searchResults.total = total;
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-center text-3xl font-bold tracking-tight">Search Pastes</h1>
        <SearchForm initialQuery={query} />
        <SearchResults searchResults={searchResults} />
      </div>
    </div>
  )
}
