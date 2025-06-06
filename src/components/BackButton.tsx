import React from "react";
import { useNavigate } from "react-router-dom";

// BackButton clásico: vuelve a la página anterior del historial
const BackButton: React.FC = React.memo(() => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="top-6 left-6 z-50 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded shadow transition-all duration-150 flex items-center gap-2"
      aria-label="Volver atrás"
      style={{ minWidth: 0 }}
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
      <span className="hidden sm:inline">Volver atrás</span>
    </button>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;
