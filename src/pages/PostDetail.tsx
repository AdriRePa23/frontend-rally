import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import PostView from "../components/PostView";
import BackButton from "../components/BackButton";

interface PostDetailData {
  id: number;
  fotografia: string;
  usuario_id: number;
  votos: number;
  creador: {
    id: number;
    nombre: string;
    foto_perfil: string;
  };
  estado?: string;
}

const PostDetail: React.FC = () => {
  const { id_publicacion } = useParams<{ id_publicacion: string }>();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/publicaciones/${id_publicacion}`);
        const postRaw = response.data;
        let creador = { id: postRaw.usuario_id, nombre: "", foto_perfil: "" };
        try {
          const usuarioRes = await API.get(`/usuarios/${postRaw.usuario_id}`);
          creador = {
            id: usuarioRes.data.id,
            nombre: usuarioRes.data.nombre,
            foto_perfil: usuarioRes.data.foto_perfil,
          };
        } catch {}
        let votos = 0;
        try {
          const votosRes = await API.get(
            `/votaciones?publicacion_id=${postRaw.id}`
          );
          if (Array.isArray(votosRes.data)) {
            votos = votosRes.data.length;
          } else {
            votos = votosRes.data?.votos ?? 0;
          }
        } catch {}
        setPost({
          id: postRaw.id,
          fotografia: postRaw.fotografia,
          usuario_id: postRaw.usuario_id,
          votos,
          creador,
          estado: postRaw.estado,
        });
      } catch (err) {
        setError("No se pudo cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    // Obtener usuario autenticado
    const token = localStorage.getItem("token");
    if (token) {
      API.post(
        "/auth/verify-token",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => setUsuario(res.data.user))
        .catch(() => setUsuario(null));
    }
  }, [id_publicacion]);

  const puedeAcceder =
    post &&
    (post.estado !== "pendiente" ||
      (usuario &&
        (usuario.id === post.usuario_id ||
          usuario.rol_id === 2 ||
          usuario.rol_id === 3)));

  if (loading)
    return (
      <div className="text-center py-8 text-white bg-gray-950">Cargando...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 py-8 bg-gray-950">{error}</div>
    );
  if (!post) return null;
  if (!puedeAcceder)
    return (
      <div className="flex h-screen bg-gray-950">
        <AsideNavBar />
        <main className="flex-1 flex items-center justify-center text-red-500 md:ml-64 pt-20 md:pt-0 bg-gray-950">
          No tienes permiso para ver esta publicación.
        </main>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto w-full max-w-full md:ml-64 pt-20 md:pt-0 mt-8">
        
        {post.estado === "pendiente" && (
          <div className="mb-4">
            <span className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full text-sm shadow">
              Esta publicación está pendiente de validación
            </span>
          </div>
        )}
        <div className="flex items-center mb-4">
          <BackButton />
          
        </div>
        <PostView id={post.id} />
      </main>
    </div>
  );
};

export default PostDetail;
