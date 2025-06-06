import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// BackButton optimizado: solo para PostDetail, vuelve al rally asociado
const BackButton: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { id, rally_id } = useParams();

  // Extrae el rallyId de la URL o params
  const rallyId =
    rally_id ||
    id ||
    window.location.pathname.match(/^\/rallies\/(\d+)\/publicacion\/\d+/)?.[1];

  const handleBack = () => {
    rallyId ? navigate(`/rallies/${rallyId}`) : navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="fixed top-6 left-6 z-50 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded shadow transition-all duration-150 flex items-center gap-2"
      aria-label="Volver a la galería"
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
      <span className="hidden sm:inline">Volver a la galería</span>
    </button>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;
