import React, { useEffect, useState } from "react";
import PostMain from "./PostMain/PostMain";
import PostComments from "./PostComments/PostComments";
import API from "../services/api";

interface PostViewProps {
  id: number;
  fotografia: string;
  creador: {
    nombre: string;
    foto_perfil: string;
  };
}

const PostView: React.FC<PostViewProps> = ({ id, fotografia, creador }) => {
  const [votos, setVotos] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [descripcion, setDescripcion] = useState<string>("");

  useEffect(() => {
    const fetchVotos = async () => {
      try {
        const votosRes = await API.get(`/votaciones?publicacion_id=${id}`);
        if (Array.isArray(votosRes.data)) {
          setVotos(votosRes.data.length);
        } else {
          setVotos(votosRes.data?.votos ?? 0);
        }
      } catch {
        setVotos(0);
      } finally {
        setLoading(false);
      }
    };
    const fetchDescripcion = async () => {
      try {
        const res = await API.get(`/publicaciones/${id}`);
        setDescripcion(res.data.descripcion || "");
      } catch {
        setDescripcion("");
      }
    };
    fetchVotos();
    fetchDescripcion();
  }, [id]);

  if (loading) return <div className="text-center py-8">Cargando publicación...</div>;

  return (
    <div className="w-full rounded-xl shadow-lg flex flex-col md:flex-row my-8">
      <div className="relative md:w-2/3 w-full">
        <PostMain fotografia={fotografia} creador={creador} descripcion={descripcion} votos={votos} />
      </div>
      <div className="md:w-[40%] w-full flex flex-col">
        <PostComments publicacionId={id} />
      </div>
    </div>
  );
};

export default PostView;
