import PasteView from "@/components/paste-view"
import { notFound } from "next/navigation"
import { getPaste } from "@/lib/db"
import { Paste } from "@/lib/constants"

async function getPasteData(id: string): Promise<Paste | null> {
  // In a real app with a remote API, you would use fetch here
  // But since we're using a local file-based storage, we can call the function directly
  return getPaste(id);
}

export default async function PastePage({ params }: { params: { id: string } }) {
  const paste = await getPasteData(params.id);

  if (!paste) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <PasteView paste={paste} />
      </div>
    </div>
  )
}
