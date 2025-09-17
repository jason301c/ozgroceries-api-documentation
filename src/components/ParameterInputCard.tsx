import React from "react";
import type { ApiEndpoint } from "../hooks/useApiCall";

type ApiParameter = ApiEndpoint["parameters"][number];

interface ParameterInputCardProps {
  param: ApiParameter;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ParameterInputCard: React.FC<ParameterInputCardProps> = ({
  param,
  value,
  onChange,
  className = "",
}) => {
  const descriptionId = `param-${param.name}-description`;
  const isBoolean = param.type === "boolean";
  const inputClasses =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(255,140,66,0.2)]";

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-[rgba(255,140,66,0.18)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-gray-800">
          {param.name}
          {param.required && (
            <span className="ml-1 text-primary-500" aria-hidden>
              *
            </span>
          )}
        </div>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
          {param.type}
        </span>
      </div>

      <div className="mt-2">
        {isBoolean ? (
          <select
            aria-describedby={descriptionId}
            className={`${inputClasses} appearance-none`}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Select a value</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        ) : (
          <input
            aria-describedby={descriptionId}
            type="text"
            inputMode={param.type === "number" ? "decimal" : undefined}
            placeholder={param.description}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputClasses} invalid:border-[rgba(255,140,66,0.45)]`}
          />
        )}
      </div>

      <p id={descriptionId} className="mt-2 text-xs leading-snug text-gray-600">
        {param.description}
      </p>
    </div>
  );
};

export default ParameterInputCard;
