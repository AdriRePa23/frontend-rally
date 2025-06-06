import React, { useState, useCallback } from "react";
import API from "../../services/api";

export interface RallyStatsProps {
  rallyId: number;
}

interface TopImage {
  id: number;
  descripcion: string;
  votos: number;
}

interface RallyStatsData {
  total_publicaciones: number;
  total_votos: number;
  total_participantes: number;
  top_3_mas_votadas: TopImage[];
}

const RallyStats: React.FC<RallyStatsProps> = ({ rallyId }) => {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<RallyStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/estadisticas/rally/${rallyId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setStats(res.data);
    } catch {
      setStats(null);
      setError("No tienes permisos para ver las estadísticas.");
    } finally {
      setLoading(false);
    }
  }, [rallyId]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    fetchStats();
  }, [fetchStats]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setStats(null);
    setError(null);
  }, []);

  return (
    <>
      <button
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2 rounded-full shadow transition-all duration-150"
        onClick={handleOpen}
        type="button"
      >
        Ver estadísticas
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full relative text-white">
            <button
              onClick={handleClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
              aria-label="Cerrar"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Estadísticas del rally</h2>
            {loading ? (
              <div className="text-gray-300 py-8 text-center">Cargando estadísticas...</div>
            ) : error ? (
              <div className="text-red-400 py-8 text-center">{error}</div>
            ) : stats ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Publicaciones: {stats.total_publicaciones}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Votos: {stats.total_votos}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Participantes: {stats.total_participantes}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-pink-300 text-sm block mb-2">Top 3 imágenes más votadas:</span>
                  <div className="flex flex-col gap-2">
                    {stats.top_3_mas_votadas && stats.top_3_mas_votadas.length > 0 ? (
                      stats.top_3_mas_votadas.map((img, idx) => (
                        <a
                          key={img.id}
                          href={`/rallies/${rallyId}/publicacion/${img.id}`}
                          className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2 hover:bg-pink-900 transition"
                          title={img.descripcion}
                        >
                          <span className="font-bold text-pink-200 text-lg w-6 text-center">{idx + 1}</span>
                          <span className="flex-1 text-white truncate">{img.descripcion}</span>
                          <span className="text-pink-300 font-bold">{img.votos} votos</span>
                        </a>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No hay imágenes con votos.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 py-8 text-center">No hay estadísticas disponibles.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RallyStats;
