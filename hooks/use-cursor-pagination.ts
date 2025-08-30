"use client"

import { useState, useCallback } from "react"
import { getRentalsWithCursor, type Rental, type RentalFilters } from "@/lib/api-cursor"

export function useCursorPagination(filters: RentalFilters = {}) {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [hasMore, setHasMore] = useState(true)

  const loadInitialRentals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getRentalsWithCursor({ ...filters, limit: 12 })

      setRentals(response.items)
      setNextCursor(response.next_cursor)
      setHasMore(response.has_more)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rentals")
    } finally {
      setLoading(false)
    }
  }, [filters])

  const loadMoreRentals = useCallback(async () => {
    if (loadingMore || !hasMore || !nextCursor) return

    try {
      setLoadingMore(true)

      const response = await getRentalsWithCursor({
        ...filters,
        limit: 12,
        cursor: nextCursor,
      })

      setRentals((prev) => [...prev, ...response.items])
      setNextCursor(response.next_cursor)
      setHasMore(response.has_more)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more rentals")
    } finally {
      setLoadingMore(false)
    }
  }, [filters, nextCursor, hasMore, loadingMore])

  return {
    rentals,
    loading,
    loadingMore,
    error,
    hasMore,
    loadInitialRentals,
    loadMoreRentals,
  }
}
