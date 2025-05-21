import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

// Mock data for recent pastes
const recentPastes = [
  { id: "abc123", title: "React Hooks Example", createdAt: "2023-05-15T10:30:00Z" },
  { id: "def456", title: "CSS Grid Layout", createdAt: "2023-05-14T14:45:00Z" },
  { id: "ghi789", title: "TypeScript Interface", createdAt: "2023-05-13T09:15:00Z" },
]

export default function RecentPastes() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Recent Pastes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPastes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPastes.map((paste) => (
                  <tr key={paste.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-2 text-sm truncate max-w-[200px]">{paste.title}</td>
                    <td className="py-3 px-2 text-sm font-mono">{paste.id}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{formatDate(paste.createdAt)}</td>
                    <td className="py-3 px-2 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/paste/${paste.id}`}>
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">No recent pastes found</div>
        )}
      </CardContent>
    </Card>
  )
}
