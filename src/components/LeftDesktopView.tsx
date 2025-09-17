import React from "react";
import type { ApiEndpoint } from "../hooks/useApiCall";

interface LeftDesktopViewProps {
  selectedEndpoint: ApiEndpoint | null;
  onEndpointSelect: (endpoint: ApiEndpoint) => void;
  apiEndpoints: ApiEndpoint[];
}

const LeftDesktopView: React.FC<LeftDesktopViewProps> = ({
  selectedEndpoint,
  onEndpointSelect,
  apiEndpoints,
}) => {
  return (
    <div className="flex w-[22rem] flex-col overflow-hidden border-r border-gray-200 bg-white">
      <div className="bg-primary-600 px-6 py-5 text-white">
        <h1 className="text-2xl font-semibold text-white">
          OzGroceries API (Beta)
        </h1>
        <p className="mt-2 text-sm text-white/90">
          Explore a simple API for fetching Australian grocery data from major
          retailers.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-gray-100 hover:scrollbar-thumb-primary-600">
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Disclaimer
            </h2>
            <div className="space-y-3 text-sm leading-snug text-gray-600">
              <p>
                OzGroceries API is a public, community-maintained service that
                aggregates publicly available product and pricing information
                from major Australian grocery retailers.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Not affiliated with, sponsored by, or endorsed by any
                  retailer.
                </li>
                <li>
                  Data is provided “as is” and may be incomplete, inaccurate, or
                  change without notice.
                </li>
                <li>
                  For informational use only; ensure compliance with applicable
                  laws and retailer terms.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Available Endpoints
            </h2>
            <div className="space-y-3">
              {apiEndpoints.map((endpoint) => {
                const isSelected = selectedEndpoint === endpoint;
                return (
                  <button
                    key={endpoint.path}
                    type="button"
                    onClick={() => onEndpointSelect(endpoint)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary-500 bg-primary-50 shadow-sm"
                        : "border-gray-200 bg-gray-50 hover:border-primary-400 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm font-semibold text-gray-800">
                        {endpoint.path}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      {endpoint.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LeftDesktopView;
