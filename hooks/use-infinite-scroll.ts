"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseInfiniteScrollOptions<T> {
  fetchItems: (page: number, limit: number) => Promise<T[]>
  initialPage?: number
  limit?: number
  dependencies?: any[]
}

export function useInfiniteScroll<T>({
  fetchItems,
  initialPage = 0,
  limit = 12,
  dependencies = [],
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)

  // Function to load initial items
  const loadInitialItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setItems([])

      const data = await fetchItems(initialPage, limit)

      setItems(data)
      setHasMore(data.length === limit)
      setPage(initialPage + 1)
      setInitialized(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items")
    } finally {
      setLoading(false)
    }
  }, [fetchItems, initialPage, limit, ...dependencies])

  // Function to load more items
  const loadMoreItems = useCallback(async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)

      const data = await fetchItems(page, limit)

      if (data.length > 0) {
        setItems((prev) => [...prev, ...data])
        setPage((prev) => prev + 1)
      }

      setHasMore(data.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more items")
    } finally {
      setLoadingMore(false)
    }
  }, [fetchItems, page, limit, hasMore, loadingMore])

  // Load initial items on mount or when dependencies change
  useEffect(() => {
    loadInitialItems()
  }, dependencies)

  // Create ref callback for the last item
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || loadingMore || !initialized) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreItems()
          }
        },
        {
          rootMargin: "100px",
        },
      )

      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore, loadMoreItems, initialized],
  )

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    lastItemRef,
    reset: loadInitialItems,
    setItems,
  }
}
