import Link from "next/link"
import { Code2 } from "lucide-react"
import { MobileNav } from "./mobile-nav"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold tracking-tight">
            PasteDump
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Search
          </Link>
          <Link
            href="/api"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            API
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}
