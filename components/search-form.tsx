"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"

interface SearchFormProps {
  initialQuery?: string;
}

export default function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state if initialQuery changes (e.g. browser navigation)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSubmitting(false);
  };

  // Check if query looks like an ID (6 chars, alphanumeric)
  const isIdSearch = /^[a-zA-Z0-9]{1,6}$/.test(query);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="pt-6">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by title, content, or paste ID..." 
              className="pl-9 bg-background/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              {isIdSearch && query && 
                <span className="text-primary">Looking for paste with ID: <strong>{query}</strong></span>
              }
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
