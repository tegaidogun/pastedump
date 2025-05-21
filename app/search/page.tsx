import SearchForm from "@/components/search-form"
import SearchResults from "@/components/search-results"

export default function SearchPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-center text-3xl font-bold tracking-tight">Search Pastes</h1>
        <SearchForm />
        <SearchResults />
      </div>
    </div>
  )
}
