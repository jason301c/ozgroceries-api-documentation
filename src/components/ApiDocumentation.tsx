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
    <div className="api-documentation">
      <div className="split-layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>OzGroceries API</h1>
            <p className="sidebar-description">
              Explore and test the OzGroceries API endpoints for Australian
              grocery product data.
            </p>
          </div>
          <div className="endpoints-list">
            <h2>Available Endpoints</h2>
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className={`endpoint-item ${
                  selectedEndpoint === endpoint ? "selected" : ""
                }`}
                onClick={() => handleEndpointSelect(endpoint)}
              >
                <div className="method-path">
                  <span className="method">{endpoint.method}</span>
                  <span className="path">{endpoint.path}</span>
                </div>
                <p className="endpoint-description">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="main-content">
          {selectedEndpoint ? (
            <div className="endpoint-details">
              <div className="endpoint-header">
                <h2>
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </h2>
                <p>{selectedEndpoint.description}</p>
              </div>

              <div className="parameters-section">
                <h3>Parameters</h3>
                <div className="parameters-grid">
                  {selectedEndpoint.parameters.map((param, index) => (
                    <div key={index} className="parameter-item">
                      <label>
                        <span className="param-name">{param.name}</span>
                        <span className="param-type">({param.type})</span>
                        {param.required && <span className="required">*</span>}
                      </label>
                      <input
                        type={param.type === "number" ? "number" : "text"}
                        placeholder={param.description}
                        value={requestParams[param.name] || ""}
                        onChange={(e) =>
                          handleParamChange(param.name, e.target.value)
                        }
                      />
                      <p className="param-description">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="request-section">
                <button
                  onClick={executeRequest}
                  disabled={loading}
                  className="execute-btn"
                >
                  {loading ? "Executing..." : "Execute Request"}
                </button>
              </div>

              {error && (
                <div className="error-section">
                  <h3>Error</h3>
                  <pre className="error-message">{error}</pre>
                </div>
              )}

              {response && (
                <div className="response-section">
                  <h3>Response</h3>
                  <pre className="response-json">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <h2>Welcome to OzGroceries API</h2>
                <p>
                  Select an endpoint from the left sidebar to start exploring
                  the API documentation and testing endpoints.
                </p>
                <div className="feature-highlights">
                  <div className="feature-item">
                    <div>
                      <h4>Product Search</h4>
                      <p>Advanced filtering and search capabilities</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div>
                      <h4>Price History</h4>
                      <p>Track historical price changes over time</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div>
                      <h4>Barcode Lookup</h4>
                      <p>Find products by barcode or GTIN</p>
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
