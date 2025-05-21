import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">Integrate PasteDump into your applications with our simple API</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Basic information about the PasteDump API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The PasteDump API allows you to create, retrieve, and search pastes programmatically. All API
                  endpoints are available at{" "}
                  <code className="text-xs bg-background/70 px-1 py-0.5 rounded">https://api.pastedump.com/v1</code>.
                </p>
                <p>
                  Authentication is required for creating pastes. You can obtain an API key from your account settings.
                </p>
                <div className="rounded-md bg-background/50 p-4 border border-border/50">
                  <p className="text-sm font-medium">Base URL</p>
                  <pre className="mt-2 overflow-x-auto p-2 bg-background/80 rounded text-xs">
                    https://api.pastedump.com/v1
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>Information about API usage limits</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The API is rate limited to prevent abuse. The current limits are:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Anonymous users: 10 requests per minute</li>
                  <li>Authenticated users: 60 requests per minute</li>
                  <li>Premium users: 300 requests per minute</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create a Paste</CardTitle>
                <CardDescription>POST /pastes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Creates a new paste and returns the paste ID and URL.</p>
                <div className="rounded-md bg-background/50 p-4 border border-border/50">
                  <p className="text-sm font-medium">Request Body</p>
                  <pre className="mt-2 overflow-x-auto p-2 bg-background/80 rounded text-xs">
                    {`{
  "title": "Optional title",
  "content": "Required paste content",
  "expiration": "never | 5min | 1hour | 1day",
  "syntax": "auto | plain | javascript | python | ..."
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Get a Paste</CardTitle>
                <CardDescription>GET /pastes/{"{id}"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Retrieves a paste by its ID.</p>
                <div className="rounded-md bg-background/50 p-4 mt-4 border border-border/50">
                  <p className="text-sm font-medium">Response</p>
                  <pre className="mt-2 overflow-x-auto p-2 bg-background/80 rounded text-xs">
                    {`{
  "id": "abc123",
  "title": "Example Paste",
  "content": "Paste content goes here",
  "syntax": "plain",
  "created_at": "2023-05-15T10:30:00Z",
  "expires_at": null,
  "view_count": 42
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Pastes</CardTitle>
                <CardDescription>GET /pastes/search?q={"{query}"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Searches for pastes by title or content.</p>
                <div className="rounded-md bg-background/50 p-4 mt-4 border border-border/50">
                  <p className="text-sm font-medium">Response</p>
                  <pre className="mt-2 overflow-x-auto p-2 bg-background/80 rounded text-xs">
                    {`{
  "results": [
    {
      "id": "abc123",
      "title": "Example Paste",
      "created_at": "2023-05-15T10:30:00Z",
      "view_count": 42
    },
    ...
  ],
  "total": 5,
  "page": 1,
  "per_page": 20
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Creating a Paste with cURL</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto p-4 bg-background/80 rounded text-xs">
                  {`curl -X POST https://api.pastedump.com/v1/pastes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "title": "Example cURL Request",
    "content": "This is an example paste created with cURL",
    "expiration": "1day"
  }'`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creating a Paste with JavaScript</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto p-4 bg-background/80 rounded text-xs">
                  {`// Using fetch API
async function createPaste() {
  const response = await fetch('https://api.pastedump.com/v1/pastes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      title: 'Example JavaScript Request',
      content: 'This is an example paste created with JavaScript',
      expiration: '1hour'
    })
  });
  
  const data = await response.json();
  console.log('Created paste:', data);
}

createPaste();`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creating a Paste with Python</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto p-4 bg-background/80 rounded text-xs">
                  {`import requests
import json

url = "https://api.pastedump.com/v1/pastes"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "title": "Example Python Request",
    "content": "This is an example paste created with Python",
    "expiration": "never"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(f"Created paste: {data}")`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
