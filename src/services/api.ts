interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

interface Product {
  id: number;
  sku: string;
  supermarket: string;
  name: string;
  brand: string;
  price: string;
  description?: string;
  category?: string;
  in_stock?: boolean;
  on_special?: boolean;
  gtin?: string;
}

interface PriceHistory {
  id: number;
  price: string;
  was_price?: string;
  is_on_special: boolean;
  recorded_at: string;
}

interface SearchParams {
  q?: string;
  supermarket?: string;
  brand?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  on_special?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async searchProducts(params: SearchParams): Promise<ApiResponse<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    has_next: boolean;
    has_prev: boolean;
    filters: any;
  }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${this.baseUrl}/products/search?${searchParams}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getBarcodeLookup(barcode: string): Promise<ApiResponse<{
    product: Product;
    alternatives: Product[];
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/barcode/${barcode}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getPriceHistory(params: {
    product_id?: number;
    gtin?: string;
    sku?: string;
    supermarket?: string;
    days?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<{
    product: Product;
    price_history: PriceHistory[];
    summary: any;
  }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${this.baseUrl}/products/price-history?${searchParams}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getRecommendations(params: {
    product_id?: number;
    gtin?: string;
    sku?: string;
    supermarket?: string;
    limit?: number;
    strategy?: string;
  }): Promise<ApiResponse<{
    product: Product;
    recommendations: Product[];
    strategy: string;
    total_recommendations: number;
  }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${this.baseUrl}/products/recommendations?${searchParams}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const apiClient = new ApiClient();
export type { Product, PriceHistory, SearchParams, ApiResponse };