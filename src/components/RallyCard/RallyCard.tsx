import React from "react";
import { Link } from "react-router-dom";
import { Rally } from "../../types";

interface RallyCardProps {
    rally: Rally;
}

const RallyCard: React.FC<RallyCardProps> = ({ rally }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            {rally.imagen && (
                <img
                    src={rally.imagen}
                    alt={`Imagen más votada de ${rally.nombre}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            )}
            <h3 className="text-xl font-bold">{rally.nombre}</h3>
            <p className="text-gray-600">{rally.descripcion}</p>
            <Link
                to={`/rallies/${rally.id}`}
                className="text-blue-500 hover:underline mt-4 block"
            >
                Ver publicaciones
            </Link>
        </div>
    );
};

export default RallyCard;