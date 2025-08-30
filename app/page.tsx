"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, MapPinHouse as Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RentalCard } from "@/components/rental-card";
import { RentalDetailsModal } from "@/components/rental-details-modal";
import { HealthStatus } from "@/components/health-status";
import { getRentals, type Rental } from "@/lib/api";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Reference for the last rental item to observe
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRentalElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;

      // Disconnect previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          // If the last element is visible and we have more items to load
          if (entries[0].isIntersecting && hasMore) {
            loadMoreRentals();
          }
        },
        {
          rootMargin: "100px", // Start loading when item is 100px from viewport
        }
      );

      // Observe the last element
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  // Initial load
  useEffect(() => {
    const fetchInitialRentals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRentals({ limit: ITEMS_PER_PAGE, offset: 0 });
        setRentals(data);
        setHasMore(data.length === ITEMS_PER_PAGE);
        setPage(1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch rentals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialRentals();

    // Clean up observer on unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Function to load more rentals
  const loadMoreRentals = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextOffset = page * ITEMS_PER_PAGE;
      const data = await getRentals({
        limit: ITEMS_PER_PAGE,
        offset: nextOffset,
      });

      if (data.length > 0) {
        setRentals((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newRentals = data.filter((r) => !existingIds.has(r.id));
          return [...prev, ...newRentals];
        });
        setPage((prev) => prev + 1);
      }

      // Check if we've reached the end
      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more rentals"
      );
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">@PoliHouse RentalFinder</h1>
            </div>
            <div className="flex items-center gap-4">
              <HealthStatus />
              <Button asChild>
                <Link href="/search">Advanced Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Latest Rental Listings</h2>
          <p className="text-muted-foreground">
            Discover the most recent rental opportunities from Telegram listings
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">Loading rentals...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentals.map((rental, index) => {
                // If this is the last item, attach the ref
                if (rentals.length === index + 1) {
                  return (
                    <div ref={lastRentalElementRef} key={rental.id}>
                      <RentalCard
                        rental={rental}
                        onClick={() => setSelectedRental(rental)}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={rental.id}>
                      <RentalCard
                        rental={rental}
                        onClick={() => setSelectedRental(rental)}
                      />
                    </div>
                  );
                }
              })}
            </div>

            {loadingMore && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading more rentals...</span>
              </div>
            )}

            {!loading && !loadingMore && rentals.length === 0 && (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rentals found</h3>
                <p className="text-muted-foreground">
                  Check back later for new listings
                </p>
              </div>
            )}

            {!hasMore && rentals.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end of the listings</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Rental Details Modal */}
      <RentalDetailsModal
        rental={selectedRental}
        open={!!selectedRental}
        onClose={() => setSelectedRental(null)}
      />
    </div>
  );
}
