"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MAX_CONTENT_LENGTH } from "@/lib/constants"

export default function NewPasteForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    expiration: "1week"
  });

  // Calculate remaining characters
  const contentLength = formData.content.length;
  const remainingChars = MAX_CONTENT_LENGTH - contentLength;
  const isOverLimit = remainingChars < 0;
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert("Content is required");
      return;
    }
    
    if (isOverLimit) {
      if (!confirm("Your paste exceeds the maximum length and will be truncated. Continue?")) {
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create paste");
      }
      
      const data = await response.json();
      router.push(data.url);
      
    } catch (error) {
      console.error("Error creating paste:", error);
      alert("Failed to create paste. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input 
              id="title" 
              placeholder="Untitled paste" 
              className="bg-background/50"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="content">Content</Label>
              <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                {Math.min(contentLength, MAX_CONTENT_LENGTH).toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()} characters
                {isOverLimit && ` (${Math.abs(remainingChars).toLocaleString()} over limit)`}
              </span>
            </div>
            <Textarea
              id="content"
              placeholder="Paste your code or text here..."
              className={`min-h-[200px] bg-background/50 font-mono text-sm ${isOverLimit ? 'border-red-500' : ''}`}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            {isOverLimit && (
              <p className="text-xs text-red-500">
                Your paste exceeds the maximum length and will be truncated when saved.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Expiration</Label>
            <Select 
              defaultValue="1week"
              onValueChange={(value) => setFormData({ ...formData, expiration: value })}
            >
              <SelectTrigger id="expiration" className="bg-background/50">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="1hour">1 hour</SelectItem>
                <SelectItem value="1day">1 day</SelectItem>
                <SelectItem value="1week">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || (!formData.content.trim())}
          >
            {isSubmitting ? "Creating..." : "Create Paste"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
