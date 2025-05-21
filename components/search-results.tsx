"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileSearch, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  created_at: string;
  view_count: number;
}

interface SearchResultsProps {
  searchResults: {
    results: SearchResult[];
    total: number;
    query: string;
    page: number;
    perPage: number;
  }
}

export default function SearchResults({ searchResults }: SearchResultsProps) {
  const router = useRouter();
  const { results, total, query, page, perPage } = searchResults;
  const hasResults = results.length > 0;
  const hasQuery = query && query.trim() !== "";
  
  // Calculate pagination info
  const totalPages = Math.ceil(total / perPage);
  const showPagination = hasResults && totalPages > 1;
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>
          {hasQuery 
            ? `Search Results ${total > 0 ? `(${total} found)` : ''}`
            : "Search Results"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasResults ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Views</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-2 text-sm truncate max-w-[200px]">{result.title || "Untitled paste"}</td>
                      <td className="py-3 px-2 text-sm font-mono">{result.id}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{formatDate(result.created_at)}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground text-right">{result.view_count}</td>
                      <td className="py-3 px-2 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/paste/${result.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {showPagination && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="flex justify-center">
              <FileSearch className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">
              {hasQuery ? "No results found" : "Enter a search query to find pastes"}
            </h3>
            {hasQuery && (
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any pastes matching "{query}". Try using different keywords.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
