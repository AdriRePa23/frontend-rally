import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Rally } from "../../types";

const RallyInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rally, setRally] = useState<Rally | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRally = async () => {
      try {
        const response = await API.get(`/rallies/${id}`);
        setRally(response.data);
      } catch (err) {
        setError("No se pudo cargar el rally.");
      } finally {
        setLoading(false);
      }
    };
    fetchRally();
  }, [id]);

  // Formatear fechas a DD-MM-YYYY
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!rally) return null;

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-0 flex flex-col md:flex-row overflow-hidden mt-8 relative">
      {/* Lado izquierdo: Imagen principal */}
      {rally.imagen && (
        <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-100">
          <img
            src={rally.imagen}
            alt={`Imagen de ${rally.nombre}`}
            className="object-cover w-full h-96 md:h-full md:rounded-none rounded-t-2xl"
          />
        </div>
      )}
      {/* Lado derecho: Info */}
      <div className="md:w-1/2 w-full flex flex-col justify-between p-8">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 break-words">{rally.nombre}</h1>
          <p className="text-lg text-gray-700 mb-4">{rally.descripcion}</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Categorías: {rally.categorias}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Fecha de creación: {formatDate(rally.fecha_inicio)}
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              Fecha fin: {formatDate(rally.fecha_fin)}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              Máx. fotos/usuario: {rally.cantidad_fotos_max}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RallyInfo;
