import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import PostMain from "./PostMain/PostMain";

export interface PostViewProps {
  id: number;
}

const PostView: React.FC<PostViewProps> = React.memo(function PostView({ id }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      const response = await API.get(`/publicaciones/${id}`);
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
        descripcion: postRaw.descripcion,
        votos,
        creador,
        estado: postRaw.estado,
      });
    } catch {
      setError("No se pudo cargar la publicación.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) return <div className="text-center py-8">Cargando publicación...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!post) return null;

  return (
    <PostMain
      fotografia={post.fotografia}
      creador={post.creador}
      descripcion={post.descripcion}
      votos={post.votos}
      publicacionId={post.id}
      estado={post.estado}
    />
  );
});

PostView.displayName = "PostView";

export default PostView;
