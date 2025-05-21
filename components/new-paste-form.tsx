import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function NewPasteForm() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title (optional)</Label>
          <Input id="title" placeholder="Untitled paste" className="bg-background/50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Paste your code or text here..."
            className="min-h-[200px] bg-background/50 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration">Expiration</Label>
          <Select defaultValue="never">
            <SelectTrigger id="expiration" className="bg-background/50">
              <SelectValue placeholder="Select expiration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="5min">5 minutes</SelectItem>
              <SelectItem value="1hour">1 hour</SelectItem>
              <SelectItem value="1day">1 day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Create Paste</Button>
      </CardFooter>
    </Card>
  )
}
