import React, { useEffect, useState } from "react";
import API from "../../services/api";

const UserRallies: React.FC = () => {
  const [rallies, setRallies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRallies = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No autenticado.");
          setLoading(false);
          return;
        }
        const res = await API.post(
          "/auth/verify-token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userId = res.data.user?.id;
        if (!userId) {
          setError("No se pudo obtener el usuario.");
          setLoading(false);
          return;
        }
        const ralliesRes = await API.get(`/rallies/usuario/${userId}`);
        setRallies(ralliesRes.data);
      } catch {
        setError("No se pudieron cargar los rallies.");
      } finally {
        setLoading(false);
      }
    };
    fetchRallies();
  }, []);

  if (loading)
    return <div className="text-center py-8">Cargando rallies...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;
  if (rallies.length === 0)
    return <p className="text-gray-500 text-center">No has creado ningún rally.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 w-full justify-items-center">
      {rallies.map((rally) => {
        const isActivo = new Date(rally.fecha_fin) >= new Date();
        return (
          <a
            key={rally.id}
            href={`/rallies/${rally.id}`}
            className="bg-gradient-to-br from-blue-200 via-white to-blue-100 shadow-xl rounded-2xl p-6 w-full max-w-xs flex flex-col justify-between hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"
          >
            <h3 className="text-2xl font-extrabold text-blue-900 mb-2">
              {rally.nombre}
            </h3>
            <p className="text-base text-gray-700 mb-4">{rally.descripcion}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                Categorías: {rally.categorias}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                Máx. fotos/usuario: {rally.cantidad_fotos_max}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-auto ${
              isActivo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {isActivo ? "Activo" : "Finalizado"}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default UserRallies;
