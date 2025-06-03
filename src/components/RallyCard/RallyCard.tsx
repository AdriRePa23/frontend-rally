import React from "react";
import { Link } from "react-router-dom";
import { Rally } from "../../types";

// Tipado explícito y exportable para reutilización
export interface RallyCardProps {
  rally: Rally;
}

// Componente funcional puro y memoizado
const RallyCard: React.FC<RallyCardProps> = React.memo(function RallyCard({ rally }) {
  return (
    <div className="bg-gradient-to-br from-blue-200 via-white to-blue-100 shadow-xl rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out">
      {rally.imagen ? (
        <img
          src={rally.imagen}
          alt={`Imagen más votada de ${rally.nombre}`}
          className="w-full h-56 object-cover rounded-2xl mb-4 border-4 border-blue-300 shadow-md animate-fadeIn"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="w-full h-56 flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-100 rounded-2xl mb-4 border-4 border-blue-200 shadow-md animate-pulse">
          <span className="text-blue-700 text-3xl font-extrabold tracking-wide">Nuevo Rally</span>
        </div>
      )}
      <h3 className="text-3xl font-extrabold text-blue-900 mb-2 animate-fadeInUp">{rally.nombre}</h3>
      <p className="text-lg text-gray-700 mb-4 animate-fadeInUp delay-100">{rally.descripcion}</p>
      <Link
        to={`/rallies/${rally.id}`}
        className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-6 rounded-full shadow transition-all duration-200 ease-in-out block text-center animate-fadeInUp delay-200"
        aria-label={`Ver publicaciones del rally ${rally.nombre}`}
      >
        Ver publicaciones
      </Link>
    </div>
  );
});

RallyCard.displayName = "RallyCard";

export default RallyCard;