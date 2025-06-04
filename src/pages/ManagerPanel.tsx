import React, { useEffect, useState } from "react";
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
}

const ManagerPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pendingRallies, setPendingRallies] = useState<Rally[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Publicacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }
      try {
        const res = await API.post("/auth/verify-token", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        if (res.data.user && (res.data.user.rol_id === 2 || res.data.user.rol_id === 3)) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch {
        setIsAllowed(false);
      }
    };
    checkRole();
  }, [navigate]);

  useEffect(() => {
    if (!isAllowed) return;
    const fetchPendings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        // Rallies pendientes: solo los que su fecha_fin < hoy
        const ralliesRes = await API.get("/rallies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hoy = new Date();
        const pendientes = (ralliesRes.data || []).filter(
          (r: Rally) => new Date(r.fecha_fin) < hoy
        );
        setPendingRallies(pendientes);
        // Publicaciones pendientes (nuevo endpoint)
        const postsRes = await API.get("/publicaciones/estado/pendiente", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingPosts(postsRes.data || []);
      } catch {
        setError("No se pudieron cargar los elementos pendientes.");
      } finally {
        setLoading(false);
      }
    };
    fetchPendings();
  }, [isAllowed]);

  const handleValidateRally = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/rallies/${id}`, { estado: "activo" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRallies((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("No se pudo validar el rally.");
    }
  };

  const handleValidatePost = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/publicaciones/publicaciones/${id}/estado`, { estado: "aprobada" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("No se pudo validar la publicación.");
    }
  };

  if (!isAllowed) {
    return (
      <div className="flex h-screen">
        <AsideNavBar />
        <main className="flex-1 flex items-center justify-center text-red-500">
          Acceso denegado
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AsideNavBar />
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Panel de Gestor</h1>
        {loading ? (
          <div className="text-center py-8">Cargando elementos pendientes...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Rallies pendientes</h2>
              {pendingRallies.length === 0 ? (
                <p className="text-gray-500">No hay rallies pendientes.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {pendingRallies.map((rally) => (
                    <li key={rally.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-blue-900">{rally.nombre}</span>
                        <span className="ml-2 text-gray-600 text-sm">{rally.descripcion}</span>
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
              <h2 className="text-2xl font-bold mb-4">Publicaciones pendientes</h2>
              {pendingPosts.length === 0 ? (
                <p className="text-gray-500">No hay publicaciones pendientes.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {pendingPosts.map((post) => (
                    <li key={post.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={post.fotografia} alt="Publicación" className="w-16 h-16 object-cover rounded-lg border" />
                        <div>
                          <span className="font-semibold text-blue-900">{post.descripcion}</span>
                          <span className="ml-2 text-gray-600 text-sm">ID: {post.id}</span>
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
