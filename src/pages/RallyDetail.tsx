import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import RallyInfo from "../components/RallyInfo/RallyInfo";
import UserPostCard from "../components/UserPostCard/UserPostCard";
import API from "../services/api";


const RallyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rally, setRally] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

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
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      API.post("/auth/verify-token", {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get(`/publicaciones?rally_id=${id}`);
        const postsRaw = response.data;
        const postsWithDetails = await Promise.all(postsRaw.map(async (post: any) => {
          let creador = { id: post.usuario_id, nombre: "", foto_perfil: "" };
          try {
            const usuarioRes = await API.get(`/usuarios/${post.usuario_id}`);
            creador = {
              id: usuarioRes.data.id,
              nombre: usuarioRes.data.nombre,
              foto_perfil: usuarioRes.data.foto_perfil,
            };
          } catch {}
          let votos = 0;
          try {
            const votosRes = await API.get(`/votaciones?publicacion_id=${post.id}`);
            if (Array.isArray(votosRes.data)) {
              votos = votosRes.data.length;
            } else {
              votos = votosRes.data?.votos ?? 0;
            }
          } catch {}
          // Recuperar el estado de la publicación desde el endpoint
          return {
            id: post.id,
            imagen: post.fotografia,
            votos,
            creador,
            estado: post.estado, // <-- aquí se recupera el estado
            rally_id: post.rally_id,
          };
        }));
        setPosts(postsWithDetails);
      } catch (err) {
        setPostsError("No se pudieron cargar las publicaciones del rally.");
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  // Permisos de acceso: solo si el rally está activo o el usuario es dueño, gestor o admin
  const puedeAcceder =
    rally &&
    (rally.estado === "activo" ||
      (user && (user.id === rally.creador_id || user.rol_id === 2 || user.rol_id === 3)));

  // Solo se puede añadir publicación si el rally está activo y el usuario está logueado
  const puedePublicar =
    rally &&
    rally.estado === "activo" &&
    isLoggedIn;

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!puedeAcceder)
    return (
      <div className="flex h-screen bg-gray-950">
        <AsideNavBar />
        <main className="flex-1 flex items-center justify-center text-red-500 md:ml-64 pt-20 md:pt-0">
          No tienes permiso para ver esta galería.
        </main>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto w-full max-w-full md:ml-64 pt-20 md:pt-0">
        <RallyInfo />
        <div className="w-full mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-pink-400">Publicaciones de la galería</h3>
              <div className="w-24 h-1 bg-pink-300 rounded-full mb-2"></div>
            </div>
            {puedePublicar && (
              <a
                href={`/rallies/${id}/publicar`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Añadir publicación
              </a>
            )}
          </div>
          {postsLoading ? (
            <div className="text-center py-8 text-white">Cargando publicaciones...</div>
          ) : postsError ? (
            <div className="text-center text-red-500 py-8">{postsError}</div>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-center">No hay publicaciones en esta galería.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
              {posts.map((post) => (
                <UserPostCard
                  key={post.id}
                  id={post.id}
                  imagen={post.imagen}
                  rally_id={post.rally_id}
                  estado={post.estado}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RallyDetail;
