import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileSearch } from "lucide-react"
import Link from "next/link"

// Mock data for search results
// This would normally come from a search query
const searchResults = [
  { id: "abc123", title: "React Hooks Example", createdAt: "2023-05-15T10:30:00Z" },
  { id: "def456", title: "CSS Grid Layout", createdAt: "2023-05-14T14:45:00Z" },
  { id: "ghi789", title: "TypeScript Interface", createdAt: "2023-05-13T09:15:00Z" },
]

// Set to true to show empty state
const showEmptyState = false

export default function SearchResults() {
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
        <CardTitle>Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        {!showEmptyState && searchResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result) => (
                  <tr key={result.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-2 text-sm truncate max-w-[200px]">{result.title}</td>
                    <td className="py-3 px-2 text-sm font-mono">{result.id}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{formatDate(result.createdAt)}</td>
                    <td className="py-3 px-2 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/paste/${result.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Go
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="flex justify-center">
              <FileSearch className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any pastes matching your search. Try using different keywords or search by ID.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
