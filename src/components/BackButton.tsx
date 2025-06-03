import React from "react";
import { useNavigate } from "react-router-dom";

// Tipado explícito y exportable para reutilización
export interface BackButtonProps {
  to?: string;
  label?: string;
}

// Componente funcional puro y memoizado
const BackButton: React.FC<BackButtonProps> = React.memo(function BackButton({ to, label }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded shadow transition-all duration-150"
      aria-label={label || "Volver atrás"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label || "Volver atrás"}
    </button>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;
