import React, { useEffect, useState, useCallback } from "react";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

interface Rally {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  creador_id: number;
  estado: string;
  created_at: string;
  updated_at: string;
}

interface Publicacion {
  id: number;
  fotografia: string;
  descripcion: string;
  estado: string;
  usuario_id: number;
  rally_id: number;
  usuario_nombre?: string;
}

const ManagerPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [pendingRallies, setPendingRallies] = useState<Rally[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Publicacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkRole = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    try {
      const res = await API.post(
        "/auth/verify-token",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.user && (res.data.user.rol_id === 2 || res.data.user.rol_id === 3)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch {
      setIsAllowed(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkRole();
  }, [checkRole]);

  useEffect(() => {
    if (!isAllowed) return;
    const fetchPendings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const ralliesRes = await API.get("/rallies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendientes = (ralliesRes.data || []).filter((r: Rally) => r.estado === "pendiente");
        setPendingRallies(pendientes);
        const postsRes = await API.get("/publicaciones/estado/pendiente", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postsRaw = postsRes.data || [];
        const postsWithUser = await Promise.all(
          postsRaw.map(async (post: Publicacion) => {
            let usuario_nombre = "";
            try {
              const usuarioRes = await API.get(`/usuarios/${post.usuario_id}`);
              usuario_nombre = usuarioRes.data.nombre;
            } catch {
              usuario_nombre = "Desconocido";
            }
            return { ...post, usuario_nombre };
          })
        );
        setPendingPosts(postsWithUser);
      } catch {
        setError("No se pudieron cargar los elementos pendientes.");
      } finally {
        setLoading(false);
      }
    };
    fetchPendings();
  }, [isAllowed]);

  const handleValidateRally = useCallback(
    async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await API.put(
          `/rallies/${id}`,
          { estado: "activo" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingRallies((prev) => prev.filter((r) => r.id !== id));
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          alert("No tienes permisos para validar galerías. Solo los gestores o administradores pueden hacerlo.");
        } else {
          alert("No se pudo validar la galería.");
        }
      }
    },
    []
  );

  const handleValidatePost = useCallback(
    async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await API.put(
          `/publicaciones/publicaciones/${id}/estado`,
          { estado: "aprobada" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPendingPosts((prev) => prev.filter((p) => p.id !== id));
      } catch {
        alert("No se pudo validar la publicación.");
      }
    },
    []
  );

  if (!isAllowed) {
    return (
      <div className="flex h-screen bg-gray-950">
        <AsideNavBar />
        <main className="flex-1 flex items-center justify-center text-red-500 md:ml-64 pt-20 md:pt-0">
          Acceso denegado
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 p-8 bg-gray-950 overflow-y-auto md:ml-64 pt-20 md:pt-0">
        <h1 className="text-3xl font-bold mb-6 text-pink-400">Panel de Gestor</h1>
        {loading ? (
          <div className="text-center py-8 text-white">Cargando elementos pendientes...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-pink-400">Galerías pendientes</h2>
              {pendingRallies.length === 0 ? (
                <p className="text-gray-400">No hay galerías pendientes.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {pendingRallies.map((rally) => (
                    <li key={rally.id} className="bg-gray-900 rounded-lg shadow p-4 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-pink-400">{rally.nombre}</span>
                        <span className="ml-2 text-gray-300 text-sm">{rally.descripcion}</span>
                      </div>
                      <button
                        onClick={() => handleValidateRally(rally.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                      >
                        Activar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4 text-pink-400">Publicaciones pendientes</h2>
              {pendingPosts.length === 0 ? (
                <p className="text-gray-400">No hay publicaciones pendientes.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {pendingPosts.map((post) => (
                    <li key={post.id} className="bg-gray-900 rounded-lg shadow p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={post.fotografia}
                          alt="Publicación"
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div>
                          <span className="font-semibold text-pink-400">{post.descripcion}</span>
                          <span className="ml-2 text-gray-300 text-sm">ID: {post.id}</span>
                          {post.usuario_nombre ? (
                            <div className="text-sm text-gray-400 mt-1">
                              Usuario:{" "}
                              <span className="font-semibold">{post.usuario_nombre}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={() => handleValidatePost(post.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                      >
                        Validar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ManagerPanel;
