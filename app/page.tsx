import NewPasteForm from "@/components/new-paste-form"
import RecentPastes from "@/components/recent-pastes"

export default function Home() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-center text-3xl font-bold tracking-tight">Create a New Paste</h1>
        <NewPasteForm />
        <RecentPastes />
      </div>
    </div>
  )
}
