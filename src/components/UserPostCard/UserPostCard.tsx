import React from "react";
import { Link } from "react-router-dom";

// Tipado explícito y exportable para reutilización
export interface UserPostCardProps {
  id: number;
  imagen: string;
  rally_id: number;
  estado?: string;
}

// Componente funcional puro y memoizado para evitar renders innecesarios
const UserPostCard: React.FC<UserPostCardProps> = React.memo(function UserPostCard({ id, imagen, rally_id, estado }) {
  const isPendiente = estado === "pendiente";

  return (
    <div
      className={`group block w-full max-w-xs ${isPendiente ? "pointer-events-none opacity-60" : ""}`}
      style={{ aspectRatio: "1/1" }}
      aria-disabled={isPendiente}
    >
      {isPendiente ? (
        <div className="relative w-full h-0 pb-[100%] rounded-xl overflow-hidden shadow-lg bg-gray-200 group-hover:shadow-xl transition-shadow duration-200">
          <img
            src={imagen}
            alt={`Publicación ${id}`}
            className="absolute inset-0 w-full h-full object-contain bg-white"
            loading="lazy"
            draggable={false}
          />
          <div className="absolute inset-0 rounded-xl border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs shadow z-20">
            Pendiente de aprobación
          </span>
        </div>
      ) : (
        <Link
          to={`/rallies/${rally_id}/publicacion/${id}`}
          className="relative w-full h-0 pb-[100%] rounded-xl overflow-hidden shadow-lg bg-gray-200 group-hover:shadow-xl transition-shadow duration-200 block"
          aria-label={`Ver publicación ${id}`}
        >
          <img
            src={imagen}
            alt={`Publicación ${id}`}
            className="absolute inset-0 w-full h-full object-contain bg-white"
            loading="lazy"
            draggable={false}
          />
          <div className="absolute inset-0 rounded-xl border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
        </Link>
      )}
    </div>
  );
});

UserPostCard.displayName = "UserPostCard";

export default UserPostCard;
