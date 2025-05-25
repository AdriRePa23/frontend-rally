import React, { useEffect, useState } from "react";
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
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [errorComentario, setErrorComentario] = useState("");

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
    fetchVotos();
  }, [id]);

  async function handleEnviarComentario(e: React.FormEvent) {
    e.preventDefault();
    setErrorComentario("");
    setEnviandoComentario(true);
    try {
      // Aquí deberías llamar a tu API para guardar el comentario
      // await API.post(`/comentarios`, { publicacion_id: id, texto: nuevoComentario });
      setNuevoComentario("");
      // Opcional: recargar comentarios
    } catch (err) {
      setErrorComentario("No se pudo enviar el comentario. Intenta de nuevo.");
    } finally {
      setEnviandoComentario(false);
    }
  }

  if (loading) return <div className="text-center py-8">Cargando publicación...</div>;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row my-8">
      {/* Columna izquierda: Imagen de fondo, autor y likes */}
      <div
        className="relative flex flex-col items-center justify-center md:w-2/3 w-full p-6 border-b md:border-b-0 md:border-r min-h-[700px]"
        style={{
          backgroundImage: 'none',
        }}
      >
        <div className="absolute inset-0 bg-black/30 rounded-lg z-0" />
        <img
          src={fotografia}
          alt="Publicación"
          className="absolute inset-0 w-full h-full object-contain rounded-lg z-0"
        />
        <div className="relative z-10 flex flex-col items-start w-full h-full justify-between">
          <div className="flex items-center gap-4 mb-4 mt-4">
            <img
              src={creador.foto_perfil}
              alt={creador.nombre}
              className="w-12 h-12 rounded-full border border-gray-300 shadow-lg"
            />
            <span className="font-semibold text-lg text-white drop-shadow">{creador.nombre}</span>
          </div>
          <div className="flex items-center gap-2 mb-4 bg-white/80 rounded px-3 py-1 shadow self-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806-3.36 5.928-3.36 6.734 0m-6.734 0A3.375 3.375 0 006.75 12c0 1.885 1.615 3.75 4.5 3.75s4.5-1.865 4.5-3.75c0-.492-.117-.96-.349-1.5m-6.768 0L6.75 12m6.75-1.5l.349 1.5" />
            </svg>
            <span className="text-lg font-bold text-blue-700">{votos}</span>
            <span className="text-gray-700">votos</span>
          </div>
        </div>
      </div>
      {/* Columna derecha: Comentarios */}
      <div className="md:w-[40%] w-full p-6 flex flex-col">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">Comentarios</h3>
        <div className="flex-1 text-gray-500 italic mb-4">Próximamente comentarios aquí...</div>
        <form className="flex gap-2" onSubmit={handleEnviarComentario}>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={e => setNuevoComentario(e.target.value)}
            maxLength={300}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
            disabled={enviandoComentario || !nuevoComentario.trim()}
          >
            {enviandoComentario ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {errorComentario && (
          <div className="text-red-500 text-sm mt-2">{errorComentario}</div>
        )}
      </div>
    </div>
  );
};

export default PostView;
