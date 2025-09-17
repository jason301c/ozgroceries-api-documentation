import React from "react";
import JSONView from "@uiw/react-json-view";

interface ResponseCardProps {
  response: any;
  error: string | null;
  loading: boolean;
  maxHeight?: string;
  className?: string;
}

const ResponseCard: React.FC<ResponseCardProps> = ({
  response,
  error,
  loading,
  maxHeight = "600px",
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Response</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">Loading response...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <h3 className="text-red-700 font-semibold mb-2">Error</h3>
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4 font-mono text-sm text-red-600 whitespace-pre-wrap break-words overflow-y-auto"
          style={{ maxHeight }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Response</h3>
        <div className="text-gray-500 text-center py-8">
          No response data available. Execute a request to see results.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Response</h3>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
          Success
        </span>
      </div>
      <div
        className="border border-gray-200 rounded-lg overflow-hidden"
        style={{ maxHeight }}
      >
        <div
          className="overflow-x-auto overflow-y-auto p-2"
          style={{ maxHeight }}
        >
          <JSONView value={response} />
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
