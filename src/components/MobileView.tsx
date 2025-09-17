import React, { useState } from "react";
import type { ApiEndpoint } from "../hooks/useApiCall";
import ParameterInputCard from "./ParameterInputCard";
import ResponseCard from "./ResponseCard";

interface MobileViewProps {
  selectedEndpoint: ApiEndpoint | null;
  loading: boolean;
  error: string | null;
  response: any;
  onEndpointSelect: (endpoint: ApiEndpoint) => void;
  onExecuteRequest: (
    endpoint: ApiEndpoint,
    params: Record<string, any>
  ) => void;
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
            <p className="text-sm text-gray-600">{endpoint.description}</p>
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

        <h3 className="text-lg font-semibold mb-3 text-gray-800">Parameters</h3>

        <div className="space-y-3 mb-6">
          {selectedEndpoint.parameters.map((param) => (
            <ParameterInputCard
              key={param.name}
              param={param}
              value={requestParams[param.name] ?? ""}
              onChange={(value) => handleParamChange(param.name, value)}
            />
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

      <ResponseCard
        response={response}
        error={error}
        loading={loading}
        className="mb-6"
      />
    </div>
  );
};

export default MobileView;
