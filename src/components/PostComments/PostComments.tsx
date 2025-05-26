import React, { useEffect, useState } from "react";
import API from "../../services/api";

interface PostCommentsProps {
  publicacionId: number;
}

const PostComments: React.FC<PostCommentsProps> = ({ publicacionId }) => {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [errorComentario, setErrorComentario] = useState("");
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.post("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuarioAutenticado(!!response.data.user);
        } catch {
          setUsuarioAutenticado(false);
        }
      } else {
        setUsuarioAutenticado(false);
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    const fetchComentarios = async () => {
      setCargandoComentarios(true);
      try {
        const res = await API.get(`/comentarios?publicacion_id=${publicacionId}`);
        setComentarios(Array.isArray(res.data) ? res.data : []);
      } catch {
        setComentarios([]);
      } finally {
        setCargandoComentarios(false);
      }
    };
    fetchComentarios();
  }, [publicacionId]);

  async function handleEnviarComentario(e: React.FormEvent) {
    e.preventDefault();
    setErrorComentario("");
    setEnviandoComentario(true);
    try {
      await API.post(`/comentarios`, { publicacion_id: publicacionId, comentario: nuevoComentario });
      setNuevoComentario("");
      // Recargar comentarios tras enviar
      const res = await API.get(`/comentarios?publicacion_id=${publicacionId}`);
      setComentarios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setErrorComentario("No se pudo enviar el comentario. Intenta de nuevo.");
    } finally {
      setEnviandoComentario(false);
    }
  }

  return (
    <div className="w-full p-6 flex flex-col h-full bg-white" >
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Comentarios</h3>
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {cargandoComentarios ? (
          <div className="text-gray-400 italic">Cargando comentarios...</div>
        ) : comentarios.length === 0 ? (
          <div className="text-gray-500 italic">No hay comentarios aún.</div>
        ) : (
          <ul className="space-y-4">
            {comentarios.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <img src={c.usuario_foto} alt={c.usuario_nombre} className="w-9 h-9 rounded-full border border-gray-300" />
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{c.usuario_nombre}</span>
                  <span className="ml-2 text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                  <div className="text-gray-700 text-base break-words">{c.comentario}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form className="flex gap-2" onSubmit={handleEnviarComentario}>
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChange={e => setNuevoComentario(e.target.value)}
          maxLength={300}
          required
          disabled={!usuarioAutenticado}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
          disabled={enviandoComentario || !nuevoComentario.trim() || !usuarioAutenticado}
        >
          {enviandoComentario ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {!usuarioAutenticado && (
        <div className="text-red-500 text-sm mt-2">Debes iniciar sesión para comentar.</div>
      )}
      {errorComentario && (
        <div className="text-red-500 text-sm mt-2">{errorComentario}</div>
      )}
    </div>
  );
};

export default PostComments;
