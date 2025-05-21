"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Code } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Paste, SUPPORTED_LANGUAGES } from "@/lib/constants"

export default function RecentPastes() {
  const [recentPastes, setRecentPastes] = useState<Paste[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPastes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/pastes");
        
        if (!response.ok) {
          throw new Error("Failed to fetch recent pastes");
        }
        
        const data = await response.json();
        setRecentPastes(data.pastes || []);
      } catch (err) {
        console.error("Error fetching recent pastes:", err);
        setError("Failed to load recent pastes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPastes();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getLanguageLabel = (syntax: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.value === syntax);
    return language ? language.label : 'Plain Text';
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Recent Pastes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">{error}</div>
        ) : recentPastes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Language</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPastes.map((paste) => (
                  <tr key={paste.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-2 text-sm truncate max-w-[200px]">{paste.title || "Untitled paste"}</td>
                    <td className="py-3 px-2 text-sm font-mono">{paste.id}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{formatDate(paste.created_at)}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Code className="h-3.5 w-3.5" />
                        <span>{getLanguageLabel(paste.syntax)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground text-right">{paste.view_count}</td>
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
