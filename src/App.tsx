import { useState, useEffect } from "react";
import { useApiCall, apiEndpoints } from "./hooks/useApiCall";
import type { ApiEndpoint } from "./hooks/useApiCall";
import LeftDesktopView from "./components/LeftDesktopView";
import RightDesktopView from "./components/RightDesktopView";
import MobileView from "./components/MobileView";

function App() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { response, loading, error, executeRequest, reset } = useApiCall();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleEndpointSelect = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    reset();
  };

  const handleExecuteRequest = (endpoint: ApiEndpoint, params: Record<string, any>) => {
    executeRequest(endpoint, params);
  };

  if (isMobile) {
    return (
      <MobileView
        selectedEndpoint={selectedEndpoint}
        loading={loading}
        error={error}
        response={response}
        onEndpointSelect={handleEndpointSelect}
        onExecuteRequest={handleExecuteRequest}
        apiEndpoints={apiEndpoints}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <LeftDesktopView
          selectedEndpoint={selectedEndpoint}
          onEndpointSelect={handleEndpointSelect}
          apiEndpoints={apiEndpoints}
        />
        <RightDesktopView
          selectedEndpoint={selectedEndpoint}
          loading={loading}
          error={error}
          response={response}
          onExecuteRequest={handleExecuteRequest}
        />
      </div>
    </div>
  );
}

export default App;
