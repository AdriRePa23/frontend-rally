import React from "react";
import { useNavigate, useLocation} from "react-router-dom";

// Tipado explícito y exportable para reutilización
export interface BackButtonProps {
  to?: string;
  label?: string;
  rallyId?: number | string;
}

// Componente funcional puro y memoizado
const BackButton: React.FC<BackButtonProps> = React.memo(function BackButton({ to, label, rallyId }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Lógica para volver a la galería asociada si estamos en la página de añadir publicación
  const handleBack = () => {
    // Si se pasa un destino explícito, ir ahí
    if (to) {
      navigate(to);
      return;
    }
    // Si hay rallyId prop, ir a la galería asociada
    if (rallyId) {
      navigate(`/rallies/${rallyId}`);
      return;
    }
    // Si la ruta es /rallies/:id/publicar, volver a la galería asociada
    const match = location.pathname.match(/^\/rallies\/(\d+)\/publicar/);
    if (match) {
      navigate(`/rallies/${match[1]}`);
      return;
    }
    // Si la ruta es /rallies/:id/publicacion/:pid, volver a la galería asociada
    const match2 = location.pathname.match(/^\/rallies\/(\d+)\/publicacion\/\d+/);
    if (match2) {
      navigate(`/rallies/${match2[1]}`);
      return;
    }
    // Si la ruta es /rallies/:id/editar, volver a la galería asociada
    const match3 = location.pathname.match(/^\/rallies\/(\d+)\/editar/);
    if (match3) {
      navigate(`/rallies/${match3[1]}`);
      return;
    }
    // Si la ruta es /usuarios/:id, volver a la home
    const match4 = location.pathname.match(/^\/usuarios\/\d+/);
    if (match4) {
      navigate("/");
      return;
    }
    // Por defecto, retroceder en el historial
    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="fixed top-6 left-6 z-50 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded shadow transition-all duration-150 flex items-center gap-2"
      aria-label={label || "Volver atrás"}
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
      <span className="hidden sm:inline">{label || "Volver atrás"}</span>
    </button>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;
