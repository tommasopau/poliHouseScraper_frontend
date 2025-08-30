export interface Rental {
  id: string;
  telegram_message_id: number;
  sender_id: number;
  sender_username: string;
  message_date: string;
  telephone?: string;
  email?: string;
  raw_text: string;
  summary: string;
  price: number;
  location: string;
  property_type: string;
  tenant_preference: string;
  availability_start?: string;
  availability_end?: string;
  num_bedrooms?: number;
  num_bathrooms?: number;
  flatmates_count?: number;
  has_extra_expenses?: boolean;
  extra_expenses_details?: string;
  duration_to_leonardo_transit?: number;
  duration_to_bovisa_transit?: number;
  duration_to_leonardo_walking?: number;
  duration_to_bovisa_walking?: number;
}

export interface RentalFilters {
  location?: string;
  property_type?: string;
  tenant_preference?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  min_bathrooms?: number;
  limit?: number;
  offset?: number;
}

const API_BASE_URL = "http://localhost:8000"; // testing

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

export async function getRentals(
  filters: RentalFilters = {}
): Promise<Rental[]> {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const endpoint = `/api/rentals${queryString ? `?${queryString}` : ""}`;

  return apiRequest<Rental[]>(endpoint);
}

export async function getHealthStatus(): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/api/healthcheck");
}
