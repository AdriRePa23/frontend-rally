import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export interface RallyPostCardProps {
  id: number;
  imagen: string;
  votos: number;
  creador: {
    id: number;
    nombre: string;
    foto_perfil: string;
  };
  rally_id: number;
  estado?: string;
  usuarioId?: number;
  userRol?: number;
}

const RallyPostCard: React.FC<RallyPostCardProps> = React.memo(
  function RallyPostCard({
    id,
    imagen,
    votos,
    creador,
    rally_id,
    estado,
    usuarioId,
    userRol,
  }) {
    const [likes, setLikes] = useState(votos || 0);
    const [voted, setVoted] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const puedeAcceder =
      estado !== "pendiente" ||
      (usuarioId && (usuarioId === creador.id || userRol === 2 || userRol === 3));

    const handleLike = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault();
        if (voted || likeLoading) return;
        setLikeLoading(true);
        try {
          const token = localStorage.getItem("token");
          let ip = "";
          try {
            const ipRes = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipRes.json();
            ip = ipData.ip;
          } catch {}
          await API.post(
            "/votaciones",
            { publicacion_id: id, ip },
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
          );
          setLikes((prev) => prev + 1);
          setVoted(true);
        } catch {
        } finally {
          setLikeLoading(false);
        }
      },
      [id, voted, likeLoading]
    );

    return (
      <div
        className={`relative flex flex-col bg-gradient-to-br from-pink-900 via-gray-900 to-pink-800 border border-pink-300 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 overflow-hidden ${
          !puedeAcceder ? "pointer-events-none opacity-60" : ""
        }`}
        style={{
          minHeight: "18vw",
          maxWidth: "100%",
          width: "100%",
          margin: "auto",
        }}
      >
        <Link
          to={puedeAcceder ? `/rallies/${rally_id}/publicacion/${id}` : "#"}
          className="block w-full relative group"
          style={{
            aspectRatio: "3/2",
            pointerEvents: puedeAcceder ? "auto" : "none",
            width: "100%",
            minHeight: "0",
          }}
          tabIndex={puedeAcceder ? 0 : -1}
          aria-label={`Ver publicación ${id}`}
        >
          <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ aspectRatio: "3/2" }}>
            <img
              src={imagen}
              alt={`Publicación ${id}`}
              className="w-full h-full object-cover transition-transform duration-200"
              loading="lazy"
              draggable={false}
              style={{ display: "block", margin: "auto", aspectRatio: "3/2" }}
            />
          </div>
          {estado === "pendiente" && (
            <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-xs shadow z-20">
              Pendiente
            </span>
          )}
        </Link>
        <div className="flex flex-col flex-1 justify-between px-6 py-4">
          <div className="flex items-center gap-6 mt-1">
            <Link
              to={`/usuarios/${creador.id}`}
              className="flex items-center gap-2 hover:underline"
              aria-label={`Ver perfil de ${creador.nombre}`}
            >
              <img
                src={creador.foto_perfil}
                alt={creador.nombre}
                className="w-12 h-12 rounded-full border-2 border-pink-400 object-cover"
                loading="lazy"
                draggable={false}
              />
              <span className="text-pink-300 font-bold text-lg truncate max-w-[30vw] drop-shadow">
                {creador.nombre}
              </span>
            </Link>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleLike}
                disabled={voted || likeLoading}
                className={`flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2 rounded-full shadow transition-all duration-150 ${
                  voted ? "opacity-60 pointer-events-none" : ""
                }`}
                title={voted ? "Ya has votado" : "Dar like"}
                type="button"
                aria-label={voted ? "Ya has votado" : "Dar like"}
                tabIndex={0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-7 w-7 ${voted ? "text-pink-200" : "text-white"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="font-bold text-xl">{likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RallyPostCard.displayName = "RallyPostCard";

export default RallyPostCard;
