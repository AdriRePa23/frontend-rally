import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

interface RallyPostCardProps {
  id: number;
  imagen: string;
  votos: number;
  creador: {
    id: number;
    nombre: string;
    foto_perfil: string;
  };
  rallyId: number;
}

const RallyPostCard: React.FC<RallyPostCardProps> = ({ id, imagen, votos, creador, rallyId }) => {
  const [likes, setLikes] = useState(votos || 0);
  const [voted, setVoted] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (voted || likeLoading) return;
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
      setLikes((prev) => prev + 1);
      setVoted(true);
    } catch {
      // Puedes mostrar un error si quieres
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="relative w-96 h-96 rounded-2xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-200">
      <Link to={`/rallies/${rallyId}/publicacion/${id}`} className="absolute inset-0 block">
        <img
          src={imagen}
          alt={`Publicación ${id}`}
          className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
        />
      </Link>
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 flex justify-between items-end">
        <Link to={`/usuarios/${creador.id}`} className="flex items-center gap-2 hover:underline">
          <img src={creador.foto_perfil} alt={creador.nombre} className="w-10 h-10 rounded-full object-cover border-2 border-blue-300" />
          <span className="text-white font-semibold text-base truncate max-w-[100px] drop-shadow">{creador.nombre}</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            disabled={voted || likeLoading}
            className={`flex items-center gap-1 text-white bg-black/40 rounded-full px-3 py-1 ml-2 transition-all duration-150 ${
              voted ? "opacity-60 pointer-events-none" : "hover:bg-pink-600"
            }`}
            title={voted ? "Ya has votado" : "Dar like"}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${voted ? "text-pink-400" : "text-pink-200"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span className="font-bold text-lg">{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RallyPostCard;
