import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download, ExternalLink, Eye, FileText, Plus, ChevronDown } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Paste {
  id: string
  title: string
  content: string
  createdAt: string
  viewCount: number
  language: string
}

export default function PasteView({ paste }: { paste: Paste }) {
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
              <CardTitle className="text-xl md:text-2xl">{paste.title}</CardTitle>
              <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span>Created: {formatDate(paste.createdAt)}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {paste.viewCount} views
                </span>
                <span>
                  ID: <code className="text-xs bg-background/70 px-1 py-0.5 rounded">{paste.id}</code>
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-8">
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href={`/paste/${paste.id}/raw`}>
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
                  <DropdownMenuItem>Download as .txt</DropdownMenuItem>
                  <DropdownMenuItem>Download as .json</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="h-8">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Copy URL
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-md border border-border/50 bg-background/50 overflow-hidden">
            <div className="overflow-x-auto">
              <pre className="p-4 text-sm font-mono">
                <div className="flex">
                  <div className="select-none text-muted-foreground pr-4 text-right">
                    {paste.content.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <code className="flex-1">
                    {paste.content.split("\n").map((line, i) => (
                      <div key={i}>{line || " "}</div>
                    ))}
                  </code>
                </div>
              </pre>
            </div>
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
