import React from "react";
import { Link } from "react-router-dom";
import { Rally } from "../../types";

export interface RallyCardProps {
  rally: Rally;
}

const RallyCard: React.FC<RallyCardProps> = React.memo(function RallyCard({ rally }) {
  const { imagen, nombre, descripcion, id } = rally;
  return (
    <div className="bg-gradient-to-br from-pink-900 via-gray-900 to-pink-800 shadow-xl rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out">
      {imagen ? (
        <img
          src={imagen}
          alt={`Imagen más votada de ${nombre}`}
          className="w-full h-56 object-cover rounded-2xl mb-4 border-4 border-pink-400 shadow-md animate-fadeIn"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="w-full h-56 flex items-center justify-center bg-gradient-to-r from-pink-400 to-pink-900 rounded-2xl mb-4 border-4 border-pink-200 shadow-md animate-pulse">
          <span className="text-pink-200 text-3xl font-extrabold tracking-wide">Nueva galería</span>
        </div>
      )}
      <h3 className="text-3xl font-extrabold text-pink-400 mb-2 animate-fadeInUp">{nombre}</h3>
      <p className="text-lg text-gray-200 mb-4 animate-fadeInUp delay-100">{descripcion}</p>
      <Link
        to={`/rallies/${id}`}
        className="bg-pink-600 hover:bg-pink-700 text-white text-lg font-bold py-2 px-6 rounded-full shadow transition-all duration-200 ease-in-out block text-center animate-fadeInUp delay-200"
        aria-label={`Ver publicaciones de la galería ${nombre}`}
      >
        Ver publicaciones
      </Link>
    </div>
  );
});

RallyCard.displayName = "RallyCard";

export default RallyCard;