import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

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
  const [likes, setLikes] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Obtener votos al montar (opcional, si quieres mostrar el número)
  React.useEffect(() => {
    const fetchVotos = async () => {
      try {
        const res = await API.get(`/votaciones?publicacion_id=${id}`);
        if (Array.isArray(res.data)) {
          setLikes(res.data.length);
        } else {
          setLikes(res.data?.votos ?? 0);
        }
      } catch {
        setLikes(null);
      }
    };
    if (!isPendiente) fetchVotos();
  }, [id, isPendiente]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (voted || likeLoading || isPendiente) return;
    setLikeLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/votaciones",
        { publicacion_id: id },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );
      setLikes((prev) => (prev !== null ? prev + 1 : 1));
      setVoted(true);
    } catch {
      // Puedes mostrar un error si quieres
    } finally {
      setLikeLoading(false);
    }
  };

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
          <button
            onClick={handleLike}
            disabled={voted || likeLoading}
            className={`absolute bottom-3 right-3 flex items-center gap-1 text-white bg-black/40 rounded-full px-3 py-1 transition-all duration-150 ${
              voted ? "opacity-60 pointer-events-none" : "hover:bg-pink-600"
            }`}
            title={voted ? "Ya has votado" : "Dar like"}
            type="button"
            aria-label={voted ? "Ya has votado" : "Dar like"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${voted ? "text-pink-400" : "text-pink-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span className="font-bold text-lg">{likes !== null ? likes : "-"}</span>
          </button>
        </Link>
      )}
    </div>
  );
});

UserPostCard.displayName = "UserPostCard";

export default UserPostCard;
