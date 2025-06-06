import React, { useEffect, useState } from "react";
import API from "../../services/api";

export interface RallyStatsProps {
  rallyId: number;
}

interface TopImage {
  id: number;
  fotografia: string;
  votos: number;
  creador_nombre: string;
}

const RallyStats: React.FC<RallyStatsProps> = ({ rallyId }) => {
  const [stats, setStats] = useState<{
    totalPublicaciones: number;
    totalUsuarios: number;
    totalVotos: number;
  } | null>(null);

  const [topImages, setTopImages] = useState<TopImage[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const [pubsRes, usersRes, votosRes] = await Promise.all([
          API.get(`/estadisticas/total-publicaciones?rally_id=${rallyId}`),
          API.get(`/estadisticas/total-usuarios?rally_id=${rallyId}`),
          API.get(`/estadisticas/total-votos?rally_id=${rallyId}`),
        ]);
        if (isMounted) {
          setStats({
            totalPublicaciones: pubsRes.data.total || 0,
            totalUsuarios: usersRes.data.total || 0,
            totalVotos: votosRes.data.total || 0,
          });
        }
      } catch {
        if (isMounted) setStats(null);
      }
    };

    const fetchTopImages = async () => {
      try {
        const res = await API.get(`/publicaciones?rally_id=${rallyId}`);
        let publicaciones = Array.isArray(res.data) ? res.data : [];
        // Obtener votos para cada publicación
        const pubsWithVotos = await Promise.all(
          publicaciones.map(async (pub: any) => {
            let votos = 0;
            try {
              const votosRes = await API.get(`/votaciones?publicacion_id=${pub.id}`);
              if (Array.isArray(votosRes.data)) {
                votos = votosRes.data.length;
              } else {
                votos = votosRes.data?.votos ?? 0;
              }
            } catch {}
            let creador_nombre = "";
            try {
              const usuarioRes = await API.get(`/usuarios/${pub.usuario_id}`);
              creador_nombre = usuarioRes.data.nombre;
            } catch {}
            return {
              id: pub.id,
              fotografia: pub.fotografia,
              votos,
              creador_nombre,
            };
          })
        );
        // Ordenar por votos descendente y tomar top 3
        pubsWithVotos.sort((a, b) => b.votos - a.votos);
        setTopImages(pubsWithVotos.slice(0, 3));
      } catch {
        setTopImages([]);
      }
    };

    fetchStats();
    fetchTopImages();
    return () => { isMounted = false; };
  }, [rallyId]);

  if (!stats) return (
    <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-semibold">
      Estadísticas no disponibles
    </span>
  );

  return (
    <>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
        Publicaciones: {stats.totalPublicaciones}
      </span>
      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
        Participantes: {stats.totalUsuarios}
      </span>
      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
        Votos: {stats.totalVotos}
      </span>
      {topImages.length > 0 && (
        <div className="flex flex-col gap-1 mt-2 w-full">
          <span className="font-bold text-pink-300 text-sm">Top 3 imágenes más votadas:</span>
          <div className="flex flex-wrap gap-3">
            {topImages.map((img, idx) => (
              <a
                key={img.id}
                href={`/rallies/${rallyId}/publicacion/${img.id}`}
                className="flex flex-col items-center bg-gray-800 rounded-lg p-2 hover:bg-pink-900 transition"
                style={{ width: 80 }}
                title={`Ver publicación de ${img.creador_nombre}`}
              >
                <img
                  src={img.fotografia}
                  alt={`Imagen ${idx + 1}`}
                  className="w-14 h-14 rounded-md object-cover border-2 border-pink-400 mb-1"
                  loading="lazy"
                  draggable={false}
                />
                <span className="text-xs text-pink-200 font-bold">{img.votos} votos</span>
                <span className="text-[10px] text-gray-300 truncate max-w-[70px]">{img.creador_nombre}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RallyStats;
