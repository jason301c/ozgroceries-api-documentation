import { useState } from 'react';
import { apiClient, type SearchParams } from '../services/api';

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  example: {
    request: any;
    response: any;
  };
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/products/search",
    description:
      "Search for products with advanced filtering, pagination, and sorting",
    parameters: [
      {
        name: "q",
        type: "string",
        required: false,
        description: "Search query string",
      },
      {
        name: "supermarket",
        type: "string",
        required: false,
        description: "Filter by supermarket",
      },
      {
        name: "brand",
        type: "string",
        required: false,
        description: "Filter by brand",
      },
      {
        name: "category",
        type: "string",
        required: false,
        description: "Filter by category",
      },
      {
        name: "min_price",
        type: "number",
        required: false,
        description: "Minimum price filter",
      },
      {
        name: "max_price",
        type: "number",
        required: false,
        description: "Maximum price filter",
      },
      {
        name: "in_stock",
        type: "boolean",
        required: false,
        description: "Filter by stock status",
      },
      {
        name: "on_special",
        type: "boolean",
        required: false,
        description: "Filter by special offers",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "Results per page",
      },
      {
        name: "offset",
        type: "number",
        required: false,
        description: "Pagination offset",
      },
      {
        name: "sort_by",
        type: "string",
        required: false,
        description: "Sort order",
      },
    ],
    example: {
      request: { q: "milk", limit: 5 },
      response: {
        products: [
          {
            id: 1,
            sku: '1234567',
            supermarket: 'woolworths',
            name: 'Example Milk 2L',
            brand: 'OzGroceries',
            price: '3.50',
            was_price: '4.00',
            is_on_special: true,
            is_in_stock: true,
            price_change_amount: -0.5,
            price_change_direction: 'down',
            price_lowest_30d: 3.25,
            price_highest_30d: 4.2,
            cup_price_display: '$1.75/L',
            first_seen_at: '2024-05-01T10:00:00.000Z',
            scraped_at: '2024-05-15T10:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
        has_next: false,
        has_prev: false,
        filters: {
          supermarkets: ['woolworths'],
          brands: ['OzGroceries'],
          categories: ['Dairy'],
          price_range: {
            min: 3.5,
            max: 3.5,
          },
        },
      },
    },
  },
  {
    method: "GET",
    path: "/products/barcode/:barcode",
    description: "Lookup a product by its barcode or GTIN",
    parameters: [
      {
        name: "barcode",
        type: "string",
        required: true,
        description: "The product barcode",
      },
    ],
    example: {
      request: { barcode: "9300633000034" },
      response: { product: {}, alternatives: [] },
    },
  },
  {
    method: "GET",
    path: "/products/price-history",
    description: "Get historical price data for a specific product",
    parameters: [
      {
        name: "product_id",
        type: "number",
        required: false,
        description: "Product ID",
      },
      {
        name: "gtin",
        type: "string",
        required: false,
        description: "Product GTIN",
      },
      {
        name: "sku",
        type: "string",
        required: false,
        description: "Product SKU",
      },
      {
        name: "supermarket",
        type: "string",
        required: false,
        description: "Supermarket name",
      },
      {
        name: "days",
        type: "number",
        required: false,
        description: "Limit to last N days",
      },
    ],
    example: {
      request: { product_id: 123, days: 30 },
      response: { product: {}, price_history: [], summary: {} },
    },
  },
  {
    method: "GET",
    path: "/products/recommendations",
    description: "Get product recommendations based on a source product",
    parameters: [
      {
        name: "product_id",
        type: "number",
        required: false,
        description: "Product ID",
      },
      {
        name: "gtin",
        type: "string",
        required: false,
        description: "Product GTIN",
      },
      {
        name: "sku",
        type: "string",
        required: false,
        description: "Product SKU",
      },
      {
        name: "supermarket",
        type: "string",
        required: false,
        description: "Supermarket name",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "Number of recommendations",
      },
      {
        name: "strategy",
        type: "string",
        required: false,
        description: "Recommendation strategy",
      },
    ],
    example: {
      request: { product_id: 123, limit: 5 },
      response: {
        product: {},
        recommendations: [],
        strategy: "similar",
        total_recommendations: 5,
      },
    },
  },
];

export function useApiCall() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = async (endpoint: ApiEndpoint, params: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result;

      switch (endpoint.path) {
        case "/products/search":
          result = await apiClient.searchProducts(params as SearchParams);
          break;
        case "/products/barcode/:barcode":
          const barcode = params.barcode;
          result = await apiClient.getBarcodeLookup(barcode);
          break;
        case "/products/price-history":
          result = await apiClient.getPriceHistory(params);
          break;
        case "/products/recommendations":
          result = await apiClient.getRecommendations(params);
          break;
        default:
          throw new Error("Unknown endpoint");
      }

      if (result.error) {
        setError(result.error);
      } else {
        setResponse(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResponse(null);
    setError(null);
    setLoading(false);
  };

  return {
    response,
    loading,
    error,
    executeRequest,
    reset,
  };
}
