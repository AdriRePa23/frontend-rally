import React, { useEffect, useState } from "react";
import API from "../../services/api";

interface Rally {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  categorias?: string;
  estado?: string;
  creador_id: number;
  cantidad_fotos_max?: number;
}

interface Usuario {
  id: number;
  nombre: string;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const RallyAdminTable: React.FC = () => {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRally, setSelectedRally] = useState<Rally | null>(null);

  useEffect(() => {
    const fetchRallies = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/rallies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ralliesData = Array.isArray(res.data) ? res.data : [];
        setRallies(ralliesData);

        // Obtener usuarios únicos
        const ids = [...new Set(ralliesData.map((r: Rally) => r.creador_id))];
        const usuariosObj: Record<number, Usuario> = {};
        await Promise.all(
          ids.map(async (id) => {
            try {
              const ures = await API.get(`/usuarios/${id}`);
              usuariosObj[id] = { id, nombre: ures.data.nombre };
            } catch {
              usuariosObj[id] = { id, nombre: "Desconocido" };
            }
          })
        );
        setUsuarios(usuariosObj);
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
      setSelectedRally(null);
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
            <thead className="text-left">
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Usuario</th>
                <th className="px-4 py-2 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rallies.map((rally) => (
                <tr key={rally.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border-b">{rally.id}</td>
                  <td className="px-4 py-2 border-b font-semibold">{rally.nombre}</td>
                  <td className="px-4 py-2 border-b">
                    <a
                      href={`/usuarios/${rally.creador_id}`}
                      className="text-blue-700 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {usuarios[rally.creador_id]?.nombre || "Desconocido"}
                    </a>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => setSelectedRally(rally)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRally && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedRally(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              title="Cerrar"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Información del Rally</h2>
            <div className="mb-4">
              <div className="mb-2"><span className="font-semibold">ID:</span> {selectedRally.id}</div>
              <div className="mb-2"><span className="font-semibold">Nombre:</span> {selectedRally.nombre}</div>
              {selectedRally.descripcion && (
                <div className="mb-2"><span className="font-semibold">Descripción:</span> {selectedRally.descripcion}</div>
              )}
              {selectedRally.categorias && (
                <div className="mb-2"><span className="font-semibold">Categorías:</span> {selectedRally.categorias}</div>
              )}
              {selectedRally.estado && (
                <div className="mb-2"><span className="font-semibold">Estado:</span> {selectedRally.estado}</div>
              )}
              {selectedRally.fecha_inicio && (
                <div className="mb-2"><span className="font-semibold">Fecha inicio:</span> {formatDate(selectedRally.fecha_inicio)}</div>
              )}
              {selectedRally.fecha_fin && (
                <div className="mb-2"><span className="font-semibold">Fecha fin:</span> {formatDate(selectedRally.fecha_fin)}</div>
              )}
              {typeof selectedRally.cantidad_fotos_max !== "undefined" && (
                <div className="mb-2"><span className="font-semibold">Máx. fotos/usuario:</span> {selectedRally.cantidad_fotos_max}</div>
              )}
              <div className="mb-2">
                <span className="font-semibold">Usuario:</span>{" "}
                <a
                  href={`/usuarios/${selectedRally.creador_id}`}
                  className="text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {usuarios[selectedRally.creador_id]?.nombre || "Desconocido"}
                </a>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleDelete(selectedRally.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold"
              >
                Eliminar
              </button>
              <button
                onClick={() => setSelectedRally(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RallyAdminTable;
