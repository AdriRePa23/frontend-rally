import React, { useEffect, useState } from "react";
import API from "../../services/api";

interface Rally {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  categorias: string;
  estado: string;
  creador_id: number;
  cantidad_fotos_max: number;
}

const RallyAdminTable: React.FC = () => {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRallies = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/rallies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRallies(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("No se pudieron cargar los rallies.");
      } finally {
        setLoading(false);
      }
    };
    fetchRallies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este rally?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/rallies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRallies((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("No se pudo eliminar el rally.");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-4">Cargando rallies...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : rallies.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No hay rallies.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Descripción</th>
                <th className="px-4 py-2 border-b">Categorías</th>
                <th className="px-4 py-2 border-b">Estado</th>
                <th className="px-4 py-2 border-b">Fecha inicio</th>
                <th className="px-4 py-2 border-b">Fecha fin</th>
                <th className="px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rallies.map((rally) => (
                <tr key={rally.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border-b">{rally.id}</td>
                  <td className="px-4 py-2 border-b font-semibold">{rally.nombre}</td>
                  <td className="px-4 py-2 border-b">{rally.descripcion}</td>
                  <td className="px-4 py-2 border-b">{rally.categorias}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      rally.estado === "activo"
                        ? "bg-green-100 text-green-800"
                        : rally.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {rally.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">{rally.fecha_inicio}</td>
                  <td className="px-4 py-2 border-b">{rally.fecha_fin}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDelete(rally.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded font-bold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RallyAdminTable;
