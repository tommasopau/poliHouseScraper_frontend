import type { ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollListProps<T> {
  items: T[]
  renderItem: (item: T, index: number, isLast: boolean, ref: (node: HTMLElement | null) => void) => ReactNode
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  emptyState: ReactNode
  className?: string
}

export function InfiniteScrollList<T extends { id: string | number }>({
  items,
  renderItem,
  loading,
  loadingMore,
  error,
  hasMore,
  emptyState,
  className = "",
}: InfiniteScrollListProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  if (items.length === 0 && !loading) {
    return <>{emptyState}</>
  }

  return (
    <div className={className}>
      {items.map((item, index) =>
        renderItem(
          item,
          index,
          index === items.length - 1,
          index === items.length - 1 ? (node: HTMLElement | null) => {} : () => {},
        ),
      )}

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading more...</span>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end of the list</p>
        </div>
      )}
    </div>
  )
}
