"use client"

import { useState, useRef, useCallback } from "react"
import { Loader2, Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RentalCard } from "@/components/rental-card"
import { RentalDetailsModal } from "@/components/rental-details-modal"
import { SearchFilters } from "@/components/search-filters"
import { HealthStatus } from "@/components/health-status"
import { getRentals, type Rental, type RentalFilters } from "@/lib/api"
import Link from "next/link"

const ITEMS_PER_PAGE = 12

export default function SearchPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [filters, setFilters] = useState<RentalFilters>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [initialSearch, setInitialSearch] = useState(false)

  // Reference for the last rental item to observe
  const observer = useRef<IntersectionObserver | null>(null)
  const lastRentalElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore || !initialSearch) return

      // Disconnect previous observer if it exists
      if (observer.current) observer.current.disconnect()

      // Create a new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          // If the last element is visible and we have more items to load
          if (entries[0].isIntersecting && hasMore) {
            loadMoreRentals()
          }
        },
        {
          rootMargin: "100px", // Start loading when item is 100px from viewport
        },
      )

      // Observe the last element
      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore, initialSearch],
  )

  const handleSearch = async (newFilters: RentalFilters) => {
    try {
      setLoading(true)
      setError(null)
      setRentals([])
      setCurrentPage(0)
      setHasMore(true)

      const data = await getRentals({
        ...newFilters,
        limit: ITEMS_PER_PAGE,
        offset: 0,
      })

      setRentals(data)
      setHasMore(data.length === ITEMS_PER_PAGE)
      setCurrentPage(1)
      setFilters(newFilters)
      setInitialSearch(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search rentals")
    } finally {
      setLoading(false)
    }
  }

  const loadMoreRentals = async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      const nextOffset = currentPage * ITEMS_PER_PAGE

      const data = await getRentals({
        ...filters,
        limit: ITEMS_PER_PAGE,
        offset: nextOffset,
      })

      if (data.length > 0) {
        // Append new rentals to existing ones
        setRentals((prev) => [...prev, ...data])
        setCurrentPage((prev) => prev + 1)
      }

      // Check if we've reached the end
      setHasMore(data.length === ITEMS_PER_PAGE)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more rentals")
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Search Rentals</h1>
            </div>
            <div className="flex items-center gap-4">
              <HealthStatus />
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <SearchFilters onSearch={handleSearch} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-lg">Searching rentals...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rentals.map((rental, index) => {
                    // If this is the last item, attach the ref
                    if (rentals.length === index + 1) {
                      return (
                        <div ref={lastRentalElementRef} key={rental.id}>
                          <RentalCard rental={rental} onClick={() => setSelectedRental(rental)} />
                        </div>
                      )
                    } else {
                      return (
                        <div key={rental.id}>
                          <RentalCard rental={rental} onClick={() => setSelectedRental(rental)} />
                        </div>
                      )
                    }
                  })}
                </div>

                {loadingMore && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading more rentals...</span>
                  </div>
                )}

                {!loading && !loadingMore && rentals.length === 0 && initialSearch && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No rentals found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters</p>
                  </div>
                )}

                {!initialSearch && !loading && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Start your search</h3>
                    <p className="text-muted-foreground">Use the filters to find your perfect rental</p>
                  </div>
                )}

                {!hasMore && rentals.length > 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You've reached the end of the listings</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Rental Details Modal */}
      <RentalDetailsModal rental={selectedRental} open={!!selectedRental} onClose={() => setSelectedRental(null)} />
    </div>
  )
}
