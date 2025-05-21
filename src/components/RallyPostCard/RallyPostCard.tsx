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
}

const RallyPostCard: React.FC<RallyPostCardProps> = ({ id, imagen, votos, creador }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64 h-80 flex flex-col hover:scale-105 transition-transform duration-200">
      <Link to={`/publicaciones/${id}`} className="w-full h-48 block">
        <img
          src={imagen}
          alt={`Publicación ${id}`}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="flex flex-col flex-1 justify-between p-4">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/usuarios/${creador.id}`} className="flex items-center gap-2 hover:underline">
            <img src={creador.foto_perfil} alt={creador.nombre} className="w-8 h-8 rounded-full object-cover border-2 border-blue-300" />
            <span className="text-blue-900 font-semibold text-sm truncate max-w-[100px]">{creador.nombre}</span>
          </Link>
        </div>
        <div className="flex items-center gap-1 text-gray-700 mt-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9l-2 2-2-2m0 6l2-2 2 2" /></svg>
          <span className="font-bold text-lg">{votos}</span>
          <span className="text-xs ml-1">votos</span>
        </div>
      </div>
    </div>
  );
};

export default RallyPostCard;
