import { Button } from "@/components/ui/button"
import { FileX } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-8 md:py-12">
      <div className="mx-auto max-w-md text-center space-y-6">
        <FileX className="h-24 w-24 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-bold tracking-tight">Paste Not Found</h1>
        <p className="text-muted-foreground">The paste you're looking for doesn't exist or has expired.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
