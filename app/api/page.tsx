"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/code-block";

export default function ApiPage() {
  const baseUrl = "https://pastedump.tegaidogun.dev";

  const createPasteExample = {
    curl: `curl -X POST ${baseUrl}/api/pastes \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "console.log(\\"Hello, World!\\");",
    "language": "javascript",
    "expiration": "1hour",
    "title": "Hello World Example"
  }'`,
    response: `{
  "id": "clwz...",
  "short_id": "aB1cD2",
  "title": "Hello World Example",
  "content": "console.log(\\"Hello, World!\\");",
  "language": "javascript",
  "expiration": "2025-06-11T14:00:00.000Z",
  "view_count": 0,
  "created_at": "2025-06-11T13:00:00.000Z",
  "url": "${baseUrl}/paste/aB1cD2"
}`
  };

  const getPasteExample = {
    curl: `curl ${baseUrl}/api/pastes/aB1cD2`,
    response: `{
  "id": "clwz...",
  "short_id": "aB1cD2",
  "title": "Hello World Example",
  "content": "console.log(\\"Hello, World!\\");",
  "language": "javascript",
  "expiration": "2025-06-11T14:00:00.000Z",
  "view_count": 1,
  "created_at": "2025-06-11T13:00:00.000Z"
}`
  };

  const getRawPasteExample = {
    curl: `curl ${baseUrl}/api/pastes/aB1cD2/raw`,
    response: `console.log("Hello, World!");`
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          Programmatically interact with PasteDump using our simple JSON API.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Authentication</CardTitle>
            <CardDescription className="mt-1">
              The PasteDump API is public and does not require authentication.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/openapi">
              View Interactive Docs
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        <EndpointCard
          title="Create a Paste"
          method="POST"
          endpoint="/api/pastes"
          description="Create a new paste. The response will include a URL to the newly created paste."
          curlExample={createPasteExample.curl}
          responseExample={createPasteExample.response}
        >
          <h4 className="font-semibold mt-4 mb-2">Body Parameters</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><code className="font-mono text-xs bg-muted p-1 rounded">content</code> (string, required): The text or code content of the paste.</li>
            <li><code className="font-mono text-xs bg-muted p-1 rounded">language</code> (string, required): The programming language for syntax highlighting. See website for supported values.</li>
            <li><code className="font-mono text-xs bg-muted p-1 rounded">expiration</code> (string, required): The expiration time. Values: '5min', '1hour', '1day', '1week'.</li>
            <li><code className="font-mono text-xs bg-muted p-1 rounded">title</code> (string, optional): An optional title for the paste.</li>
          </ul>
        </EndpointCard>

        <EndpointCard
          title="Get a Paste"
          method="GET"
          endpoint="/api/pastes/{id}"
          description="Retrieve a single paste by its unique 6-character short ID."
          curlExample={getPasteExample.curl}
          responseExample={getPasteExample.response}
        />

        <EndpointCard
          title="Get Raw Paste Content"
          method="GET"
          endpoint="/api/pastes/{id}/raw"
          description="Retrieve the raw text content of a single paste, suitable for piping or saving to a file."
          curlExample={getRawPasteExample.curl}
          responseExample={getRawPasteExample.response}
          responseLanguage="text"
        />
      </div>
    </div>
  );
}

interface EndpointCardProps {
  title: string;
  method: "GET" | "POST";
  endpoint: string;
  description: string;
  curlExample: string;
  responseExample: string;
  responseLanguage?: string;
  children?: React.ReactNode;
}

function EndpointCard({ title, method, endpoint, description, curlExample, responseExample, responseLanguage = "json", children }: EndpointCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Badge variant={method === "GET" ? "default" : "secondary"} className="text-sm">
            {method}
          </Badge>
          <h3 className="text-lg font-semibold font-mono">{endpoint}</h3>
        </div>
        <CardTitle className="pt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        <h4 className="font-semibold mt-4 mb-2">Example Request</h4>
        <CodeBlock code={curlExample} language="bash" />
        <h4 className="font-semibold mt-4 mb-2">Example Response</h4>
        <CodeBlock code={responseExample} language={responseLanguage} />
      </CardContent>
    </Card>
  );
}
