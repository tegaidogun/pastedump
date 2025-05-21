import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">About PasteDump</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A minimalist and fast pastebin clone for sharing code and text snippets
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                PasteDump was created with a simple goal: to provide a clean, fast, and efficient way to share code and
                text snippets. The focus is on minimalism and speed, prioritizing what matters most - your content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>
                    <strong>Speed</strong>: Optimized for performance with minimal load times
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>
                    <strong>Syntax Highlighting</strong>: Support for over 100 programming languages
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>
                    <strong>Expiration Options</strong>: Pastes automatically expire after a maximum of one week
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>
                    <strong>API Access</strong>: Integrate PasteDump into your applications
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>
                    <strong>No Registration Required</strong>: Create pastes instantly without an account
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Privacy is taken seriously here. All pastes are assigned random IDs that are not easily guessable, and 
                no personal information is tracked beyond what's necessary for the service to function.
              </p>
              <p className="mt-4">
                For sensitive information, it's recommended to use shorter expiration times to ensure your data is
                automatically removed as soon as possible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Have questions, suggestions, or found a bug? I'd love to hear from you!</p>
              <p className="mt-4">
                Email:{" "}
                <a href="mailto:idogunoghenetega@gmail.com" className="text-primary hover:underline">
                  idogunoghenetega@gmail.com
                </a>
              </p>
              <p className="mt-2">
                GitHub:{" "}
                <a href="https://github.com/tegaidogun" className="text-primary hover:underline">
                  github.com/tegaidogun
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
