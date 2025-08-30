export type { Rental } from "./api";
import type { Rental } from "./api";
import { apiRequest } from "./api";
export interface RentalFilters {
  location?: string;
  property_type?: string;
  tenant_preference?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  min_bathrooms?: number;
  limit?: number;
  cursor?: string; // Instead of offset, use cursor for next page
}

export interface PaginatedResponse<T> {
  items: T[];
  next_cursor?: string; // Cursor for next page
  has_more: boolean;
}

export async function getRentalsWithCursor(
  filters: RentalFilters = {}
): Promise<PaginatedResponse<Rental>> {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const endpoint = `/api/rentals${queryString ? `?${queryString}` : ""}`;

  return apiRequest<PaginatedResponse<Rental>>(endpoint);
}
