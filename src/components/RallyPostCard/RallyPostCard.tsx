import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

// Tipado explícito y exportable para reutilización
export interface RallyPostCardProps {
  id: number;
  imagen: string;
  votos: number;
  creador: {
    id: number;
    nombre: string;
    foto_perfil: string;
  };
  rallyId: number;
  estado?: string;
  usuarioId?: number;
  userRol?: number;
}

// Componente funcional puro y memoizado
const RallyPostCard: React.FC<RallyPostCardProps> = React.memo(
  function RallyPostCard({
    id,
    imagen,
    votos,
    creador,
    rallyId,
    estado,
    usuarioId,
    userRol,
  }) {
    const [likes, setLikes] = useState(votos || 0);
    const [voted, setVoted] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // Solo puede acceder si la publicación no está pendiente o si es el dueño, gestor o admin
    const puedeAcceder =
      estado !== "pendiente" ||
      (usuarioId &&
        (usuarioId === creador.id || userRol === 2 || userRol === 3));

    const handleLike = async (e?: React.MouseEvent | React.TouchEvent) => {
      if (e) e.preventDefault();
      if (voted || likeLoading) return;
      setLikeLoading(true);

      try {
        const token = localStorage.getItem("token");

        // Obtener la IP del cliente
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        // Enviar la IP junto al ID de la publicación
        await API.post(
          "/votaciones",
          {
            publicacion_id: id,
            ip: ip,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setLikes((prev) => prev + 1);
        setVoted(true);
      } catch (error) {
        console.error("Error al votar:", error);
      } finally {
        setLikeLoading(false);
      }
    };

    return (
      <div className="relative w-full max-w-xs sm:max-w-none sm:w-96 h-96 rounded-2xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-200">
        {puedeAcceder ? (
          <>
            <Link
              to={`/rallies/${rallyId}/publicacion/${id}`}
              className="absolute inset-0 block z-0"
              aria-label={`Ver publicación ${id}`}
              tabIndex={-1}
              style={{ pointerEvents: "auto" }}
            />
            <img
              src={imagen}
              alt={`Publicación ${id}`}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
              loading="lazy"
              draggable={false}
            />
            {/* El contenedor debe tener pointer-events-auto para que el botón sea clicable */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 flex justify-between items-end z-10 pointer-events-none">
              <Link
                to={`/usuarios/${creador.id}`}
                className="flex items-center gap-2 hover:underline pointer-events-auto"
                aria-label={`Ver perfil de ${creador.nombre}`}
              >
                <img
                  src={creador.foto_perfil}
                  alt={creador.nombre}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                  loading="lazy"
                  draggable={false}
                />
                <span className="text-white font-semibold text-base truncate max-w-[100px] drop-shadow">
                  {creador.nombre}
                </span>
              </Link>
              {/* El botón debe tener pointer-events-auto y z-20 para estar por encima del enlace */}
              <div className="flex items-center gap-1 pointer-events-auto z-20">
                <button
                  onClick={handleLike}
                  onTouchStart={(e) => handleLike(e)}
                  disabled={voted || likeLoading}
                  className={`flex items-center gap-1 text-white bg-black/40 rounded-full px-3 py-1 ml-2 transition-all duration-150 ${
                    voted ? "opacity-60 pointer-events-none" : "hover:bg-pink-600"
                  }`}
                  title={voted ? "Ya has votado" : "Dar like"}
                  type="button"
                  aria-label={voted ? "Ya has votado" : "Dar like"}
                  tabIndex={0}
                  style={{ position: "relative", zIndex: 30 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      voted ? "text-pink-400" : "text-pink-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span className="font-bold text-lg">{likes}</span>
                </button>
              </div>
            </div>
            {estado === "pendiente" && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs shadow z-20">
                Pendiente
              </span>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-white/70 cursor-not-allowed z-10" />
        )}
      </div>
    );
  }
);

RallyPostCard.displayName = "RallyPostCard";

export default RallyPostCard;
