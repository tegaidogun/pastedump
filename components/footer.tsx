export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PasteDump. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <p>
            Icon by <a href="https://www.flaticon.com/authors/royyan-wijaya" title="code icons" className="hover:underline">Royyan Wijaya</a> from <a href="https://www.flaticon.com/" title="Flaticon" className="hover:underline">Flaticon</a>
          </p>
          <p>
            |
          </p>
          <p>
            Created with ❤️ by <a href="https://github.com/tegaidogun" className="hover:underline">Tega Idogun</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
