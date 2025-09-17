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
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-6 bg-primary-600 text-white">
        <h1 className="text-2xl font-semibold mb-2 text-white border-none pb-0">
          OzGroceries API (Beta)
        </h1>
        <p className="text-sm text-white/90">
          Explore and test a very simple API for fetching Australian grocery
          data. Supports major retailers.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-gray-100 hover:scrollbar-thumb-primary-600">
        <h2 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
          Disclaimer
        </h2>
        <div className="text-sm text-gray-600 mb-4 space-y-2">
          <p>
            OzGroceries API is a public, community-maintained service that
            aggregates publicly available product and pricing information from
            major Australian grocery retailers.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Not affiliated with, sponsored by, or endorsed by any retailer.
            </li>
            <li>
              Data is provided “as is” and may be incomplete, inaccurate, or
              change without notice.
            </li>
            <li>
              For informational use only; ensure compliance with applicable laws
              and retailer terms.
            </li>
          </ul>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 uppercase">
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
            onClick={() => onEndpointSelect(endpoint)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded uppercase">
                {endpoint.method}
              </span>
              <span className="font-mono font-semibold text-md text-gray-700 break-all">
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
  );
};

export default LeftDesktopView;
