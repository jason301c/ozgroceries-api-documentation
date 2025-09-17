import React, { useState } from "react";
import type { ApiEndpoint } from "../hooks/useApiCall";

interface RightDesktopViewProps {
  selectedEndpoint: ApiEndpoint | null;
  loading: boolean;
  error: string | null;
  response: any;
  onExecuteRequest: (
    endpoint: ApiEndpoint,
    params: Record<string, any>
  ) => void;
}

const RightDesktopView: React.FC<RightDesktopViewProps> = ({
  selectedEndpoint,
  loading,
  error,
  response,
  onExecuteRequest,
}) => {
  const [requestParams, setRequestParams] = useState<Record<string, any>>({});

  const handleParamChange = (paramName: string, value: string) => {
    setRequestParams((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const executeRequest = () => {
    if (selectedEndpoint) {
      onExecuteRequest(selectedEndpoint, requestParams);
    }
  };

  if (!selectedEndpoint) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-none pb-0">
            Welcome to OzGroceries API
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Select an endpoint from the left sidebar to start exploring the API
            documentation and testing endpoints.
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
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md my-8">
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
                  <span className="text-gray-600 text-sm">({param.type})</span>
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
    </div>
  );
};

export default RightDesktopView;
