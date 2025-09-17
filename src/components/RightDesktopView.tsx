import React, { useState } from "react";
import type { ApiEndpoint } from "../hooks/useApiCall";
import ParameterInputCard from "./ParameterInputCard";

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
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-10 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome to OzGroceries API
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Select an endpoint from the left sidebar to explore documentation
            and run sample requests.
          </p>
          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Product Search",
                description: "Advanced filtering and search capabilities",
              },
              {
                title: "Price History",
                description: "Track historical price changes over time",
              },
              {
                title: "Barcode Lookup",
                description: "Find products by barcode or GTIN",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-sm"
              >
                <h4 className="text-sm font-semibold text-gray-800">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedEndpoint.method} {selectedEndpoint.path}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {selectedEndpoint.description}
            </p>
          </div>

          <div className="space-y-6 px-6 py-6">
            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Parameters
                </h3>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Provide only the fields you need
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {selectedEndpoint.parameters.map((param) => (
                  <ParameterInputCard
                    key={param.name}
                    param={param}
                    value={requestParams[param.name] ?? ""}
                    onChange={(value) => handleParamChange(param.name, value)}
                  />
                ))}
              </div>
            </section>

            <div className="flex flex-col items-stretch gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Fields marked with <span className="text-primary-500">*</span>{" "}
                are required.
              </p>
              <button
                onClick={executeRequest}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:shadow-primary-hover disabled:translate-y-0 disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? "Executing..." : "Execute Request"}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <h3 className="text-sm font-semibold text-red-700">Error</h3>
                <pre className="mt-2 max-h-[320px] overflow-y-auto whitespace-pre-wrap break-words rounded border border-red-200 bg-white p-3 font-mono text-xs text-red-600">
                  {error}
                </pre>
              </div>
            )}

            {response && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 shadow-inner">
                <h3 className="text-sm font-semibold text-gray-800">
                  Response
                </h3>
                <pre className="mt-3 max-h-[420px] overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs text-gray-700">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightDesktopView;
