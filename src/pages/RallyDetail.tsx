import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import RallyInfo from "../components/RallyInfo/RallyInfo";
import RallyPostCard from "../components/RallyPostCard/RallyPostCard";
import API from "../services/api";

const RallyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rally, setRally] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRally = async () => {
      try {
        const response = await API.get((`/rallies/${id}`)
        );
        setRally(response.data);
      } catch (err) {
        setError("No se pudo cargar el rally.");
      } finally {
        setLoading(false);
      }
    };
    fetchRally();
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await import("../services/api").then((m) =>
          m.default.get(`/publicaciones?rally_id=${id}`)
        );
        setPosts(response.data);
      } catch (err) {
        setPostsError("No se pudieron cargar las publicaciones del rally.");
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  // Comprobar si la fecha de fin ha pasado
  const isActive = rally && new Date(rally.fecha_fin) >= new Date();

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto w-full max-w-full">
        <RallyInfo />
        {isLoggedIn && isActive && (
          <a
            href={`/rallies/${id}/publicar`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-in-out mt-6 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 mx-auto block"
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
        {postsLoading ? (
          <div className="text-center py-8">Cargando publicaciones...</div>
        ) : postsError ? (
          <div className="text-center text-red-500 py-8">{postsError}</div>
        ) : (
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-blue-900">Publicaciones del Rally</h3>
              <div className="w-24 h-1 bg-blue-300 rounded-full mb-4"></div>
            </div>
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center">No hay publicaciones en este rally.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {posts.map((post) => (
                  <RallyPostCard
                    key={post.id}
                    id={post.id}
                    imagen={post.imagen}
                    votos={post.votos || 0}
                    creador={{
                      id: post.creador?.id,
                      nombre: post.creador?.nombre,
                      foto_perfil: post.creador?.foto_perfil,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RallyDetail;
