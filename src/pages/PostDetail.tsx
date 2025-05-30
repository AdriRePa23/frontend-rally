import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import BackButton from "../components/BackButton";
import API from "../services/api";
import PostView from "../components/PostView";

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
}

const PostDetail: React.FC = () => {
  const { id_publicacion } = useParams<{ id_publicacion: string }>();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          const votosRes = await API.get(`/votaciones?publicacion_id=${postRaw.id}`);
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
        });
      } catch (err) {
        setError("No se pudo cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id_publicacion]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!post) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto w-full max-w-full">
        <div className="mb-4">
          <BackButton />
        </div>
        <PostView id={post.id} />
      </main>
    </div>
  );
};

export default PostDetail;
