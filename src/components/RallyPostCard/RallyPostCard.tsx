import React from "react";
import { Link } from "react-router-dom";

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
        <div className="flex items-center gap-1 text-white bg-black/40 rounded-full px-3 py-1 ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-2 2-2-2m0 6l2-2 2 2" /></svg>
          <span className="font-bold text-lg">{votos}</span>
        </div>
      </div>
    </div>
  );
};

export default RallyPostCard;
