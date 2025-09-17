import React, { useState } from 'react';
import type { ApiEndpoint } from '../hooks/useApiCall';

interface MobileViewProps {
  selectedEndpoint: ApiEndpoint | null;
  loading: boolean;
  error: string | null;
  response: any;
  onEndpointSelect: (endpoint: ApiEndpoint) => void;
  onExecuteRequest: (endpoint: ApiEndpoint, params: Record<string, any>) => void;
  apiEndpoints: ApiEndpoint[];
}

const MobileView: React.FC<MobileViewProps> = ({
  selectedEndpoint,
  loading,
  error,
  response,
  onEndpointSelect,
  onExecuteRequest,
  apiEndpoints,
}) => {
  const [requestParams, setRequestParams] = useState<Record<string, any>>({});
  const [showEndpointList, setShowEndpointList] = useState(true);

  const handleParamChange = (paramName: string, value: string) => {
    setRequestParams((prev) => ({
      ...prev,
      [paramName]: value,
    }));
  };

  const handleEndpointSelect = (endpoint: ApiEndpoint) => {
    onEndpointSelect(endpoint);
    setRequestParams({});
    setShowEndpointList(false);
  };

  const executeRequest = () => {
    if (selectedEndpoint) {
      onExecuteRequest(selectedEndpoint, requestParams);
    }
  };

  if (showEndpointList) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            OzGroceries API
          </h1>
          <p className="text-sm text-gray-600">
            Explore and test the OzGroceries API endpoints for Australian
            grocery product data.
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Available Endpoints
        </h2>

        {apiEndpoints.map((endpoint, index) => (
          <div
            key={index}
            className="p-4 mb-3 bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-500 hover:shadow-primary-light"
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
            <p className="text-sm text-gray-600">
              {endpoint.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (!selectedEndpoint) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-4">
        <button
          onClick={() => setShowEndpointList(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back to Endpoints
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          {selectedEndpoint.method} {selectedEndpoint.path}
        </h2>
        <p className="text-gray-600 mb-4">{selectedEndpoint.description}</p>

        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Parameters
        </h3>

        <div className="space-y-4 mb-6">
          {selectedEndpoint.parameters.map((param, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">
                {param.description}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={executeRequest}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? "Executing..." : "Execute Request"}
        </button>
      </div>

      {error && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-red-700 font-semibold mb-2">Error</h3>
          <pre className="text-red-600 font-mono text-sm whitespace-pre-wrap break-words bg-red-50 p-3 rounded border border-red-200">
            {error}
          </pre>
        </div>
      )}

      {response && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Response</h3>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MobileView;