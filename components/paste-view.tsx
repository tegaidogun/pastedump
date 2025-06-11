"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download, ExternalLink, Eye, FileText, Plus, ChevronDown, Code } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, Suspense } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Paste, SUPPORTED_LANGUAGES } from "@/lib/constants"
import CodeBlock from "./code-block"

export default function PasteView({ paste }: { paste: Paste }) {
  // Local state for view count to prevent changing the passed prop directly
  const [viewCount, setViewCount] = useState(paste.view_count);
  
  // Get language label for display
  const language = SUPPORTED_LANGUAGES.find(lang => lang.value === paste.language) || 
    { value: 'plain', label: 'Plain Text' };
  
  // Only increment view count once on component mount
  useEffect(() => {
    // Only increment if this is a direct page visit, not a client-side navigation
    // This helps prevent duplicate counts
    const hasIncrementedViewKey = `paste-${paste.short_id}-view-incremented`;
    const hasIncrementedView = sessionStorage.getItem(hasIncrementedViewKey);
    
    if (!hasIncrementedView) {
      // Mark as incremented in session storage
      sessionStorage.setItem(hasIncrementedViewKey, 'true');
      
      // Call the increment view API endpoint
      fetch(`/api/pastes/${paste.short_id}/increment-view`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          // Only update local view count after successful API call
          setViewCount(prev => prev + 1);
        } else {
          // If the API call fails, log the error to the console for debugging
          response.json().then(err => console.error("Failed to increment view count:", err));
        }
      })
      .catch(error => {
        console.error("Failed to increment view count:", error);
      });
    }
  }, [paste.short_id]); // Only run this effect on initial mount and if paste ID changes

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">{paste.title || "Untitled paste"}</CardTitle>
              <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span suppressHydrationWarning>Created: {formatDate(paste.created_at)}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {viewCount} views
                </span>
                <span>
                  ID: <code className="text-xs bg-background/70 px-1 py-0.5 rounded">{paste.short_id}</code>
                </span>
                <span className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  {language.label}
                </span>
                {paste.expires_at && (
                  <span suppressHydrationWarning>Expires: {formatDate(paste.expires_at)}</span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-8" onClick={() => navigator.clipboard.writeText(paste.content)}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href={`/api/pastes/${paste.short_id}/raw`}>
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Raw
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const blob = new Blob([paste.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${paste.short_id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}>
                    Download as .txt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const blob = new Blob([JSON.stringify(paste, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${paste.short_id}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}>
                    Download as .json
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Copy URL
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-auto flex">
            <CodeBlock code={paste.content} language={paste.language} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Plus className="h-4 w-4 mr-2" />
              Create New Paste
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
