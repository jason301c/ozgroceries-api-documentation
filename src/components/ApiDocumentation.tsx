import React, { useState } from "react";
import { apiClient, type SearchParams } from "../services/api";

interface ApiEndpoint {
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

const apiEndpoints: ApiEndpoint[] = [
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
        products: [],
        total: 0,
        page: 1,
        limit: 20,
        has_next: false,
        has_prev: false,
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

const ApiDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    null
  );
  const [requestParams, setRequestParams] = useState<Record<string, any>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEndpointSelect = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestParams({});
    setResponse(null);
    setError(null);
  };

  const handleParamChange = (paramName: string, value: string) => {
    setRequestParams((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result;

      switch (selectedEndpoint.path) {
        case "/products/search":
          result = await apiClient.searchProducts(
            requestParams as SearchParams
          );
          break;
        case "/products/barcode/:barcode":
          const barcode = requestParams.barcode;
          result = await apiClient.getBarcodeLookup(barcode);
          break;
        case "/products/price-history":
          result = await apiClient.getPriceHistory(requestParams);
          break;
        case "/products/recommendations":
          result = await apiClient.getRecommendations(requestParams);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <h1 className="text-2xl font-bold mb-2 text-white border-none pb-0">
              OzGroceries API
            </h1>
            <p className="text-sm text-white/90">
              Explore and test the OzGroceries API endpoints for Australian
              grocery product data.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-gray-100 hover:scrollbar-thumb-primary-600">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 uppercase tracking-wide">
              Available Endpoints
            </h2>
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className={`p-4 mb-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-500 hover:shadow-primary-light hover:translate-x-0.5 ${
                  selectedEndpoint === endpoint
                    ? "border-primary-500 bg-primary-50 shadow-primary"
                    : ""
                }`}
                onClick={() => handleEndpointSelect(endpoint)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded uppercase">
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm text-gray-700 break-all">
                    {endpoint.path}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedEndpoint ? (
            <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md my-8">
              <div className="mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </h2>
                <p className="text-gray-600">{selectedEndpoint.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  ⚙️ Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {selectedEndpoint.parameters.map((param, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:border-primary-500 hover:shadow-primary-light"
                    >
                      <label className="block font-semibold mb-2">
                        <span className="text-gray-800">{param.name}</span>
                        <span className="text-gray-600 text-sm">
                          ({param.type})
                        </span>
                        {param.required && (
                          <span className="text-primary-500 font-bold">*</span>
                        )}
                      </label>
                      <input
                        type={param.type === "number" ? "number" : "text"}
                        placeholder={param.description}
                        value={requestParams[param.name] || ""}
                        onChange={(e) =>
                          handleParamChange(param.name, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-1"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {param.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 text-center">
                <button
                  onClick={executeRequest}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {loading ? "Executing..." : "Execute Request"}
                </button>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-in">
                  <h3 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                    Error
                  </h3>
                  <pre className="text-red-600 font-mono text-sm whitespace-pre-wrap break-words bg-white p-3 rounded border border-red-200">
                    {error}
                  </pre>
                </div>
              )}

              {response && (
                <div className="mb-8 animate-slide-in">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    Response
                  </h3>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-gray-100 hover:scrollbar-thumb-primary-600 shadow-inner">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-none pb-0">
                  Welcome to OzGroceries API
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Select an endpoint from the left sidebar to start exploring
                  the API documentation and testing endpoints.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="flex items-center gap-3 text-left p-4 bg-white rounded-lg shadow transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Product Search
                      </h4>
                      <p className="text-sm text-gray-600">
                        Advanced filtering and search capabilities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left p-4 bg-white rounded-lg shadow transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Price History
                      </h4>
                      <p className="text-sm text-gray-600">
                        Track historical price changes over time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left p-4 bg-white rounded-lg shadow transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Barcode Lookup
                      </h4>
                      <p className="text-sm text-gray-600">
                        Find products by barcode or GTIN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
