import React, { useEffect, useState, useRef, useCallback } from "react";
import API from "../../services/api";

export interface PostCommentsProps {
  publicacionId: number;
}

interface Comentario {
  id: number;
  usuario_id: number;
  usuario_nombre: string;
  usuario_foto: string;
  comentario: string;
  created_at: string;
}

const MAX_LENGTH = 500;

const PostComments: React.FC<PostCommentsProps> = React.memo(function PostComments({ publicacionId }) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const comentariosRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsuario(null);
      return;
    }
    API.post("/auth/verify-token", {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUsuario(res.data.user || null))
      .catch(() => setUsuario(null));
  }, []);

  useEffect(() => {
    setCargando(true);
    API.get(`/comentarios?publicacion_id=${publicacionId}`)
      .then(res => setComentarios(Array.isArray(res.data) ? res.data : []))
      .catch(() => setComentarios([]))
      .finally(() => setCargando(false));
  }, [publicacionId]);

  const validateComentario = (comentario: string): string | null => {
    if (!usuario) return "Debes iniciar sesión para comentar.";
    if (!comentario.trim()) return "El comentario no puede estar vacío.";
    if (comentario.length > MAX_LENGTH) return `El comentario no puede superar los ${MAX_LENGTH} caracteres.`;
    return null;
  };

  const handleEnviar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validation = validateComentario(nuevoComentario);
    if (validation) {
      setError(validation);
      return;
    }
    setEnviando(true);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/comentarios",
        {
          publicacion_id: publicacionId,
          comentario: nuevoComentario.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNuevoComentario("");
      const res = await API.get(`/comentarios?publicacion_id=${publicacionId}`);
      setComentarios(Array.isArray(res.data) ? res.data : []);
      setTimeout(() => {
        if (comentariosRef.current) {
          comentariosRef.current.scrollTop = comentariosRef.current.scrollHeight;
        }
      }, 100);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "No se pudo enviar el comentario. Intenta de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  }, [nuevoComentario, publicacionId, usuario]);

  const handleBorrar = useCallback(async (comentarioId: number) => {
    if (!window.confirm("¿Seguro que quieres borrar este comentario?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/comentarios/${comentarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await API.get(`/comentarios?publicacion_id=${publicacionId}`);
      setComentarios(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("No se pudo borrar el comentario.");
    }
  }, [publicacionId]);

  return (
    <div className="w-full flex flex-col h-full bg-gray-900 rounded-xl border border-gray-800 p-0 ">
      <div className="px-6 pt-5 pb-2">
        <h3 className="font-semibold text-pink-400 text-lg">Comentarios</h3>
      </div>
      <div className="flex-1 flex flex-col-reverse sm:flex-col px-6 pb-4 min-h-0 gap-0">
        <div
          style={{ overflowY: "auto", flex: 1, minHeight: 0, maxHeight: 550 }}
        >
          {cargando ? (
            <div className="text-gray-400 italic">Cargando comentarios...</div>
          ) : comentarios.length === 0 ? (
            <div className="text-gray-500 italic mb-8">No hay comentarios aún.</div>
          ) : (
            <ul className="space-y-4 pb-2" ref={comentariosRef}>
              {comentarios.map((c) => (
                <li key={c.id} className="flex items-start gap-3 bg-gray-800 p-3 rounded-lg shadow-sm">
                  <img
                    src={c.usuario_foto}
                    alt={c.usuario_nombre}
                    className="w-9 h-9 rounded-full border border-gray-700"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-pink-400 text-sm">
                      {c.usuario_nombre}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        })}
                    </span>
                    <div className="text-gray-200 text-base break-words">
                      {c.comentario}
                    </div>
                  </div>
                  {usuario &&
                    (usuario.id === c.usuario_id ||
                      usuario.rol_id === 2 ||
                      usuario.rol_id === 3) && (
                      <button
                        onClick={() => handleBorrar(c.id)}
                        className="ml-2 text-red-400 hover:text-red-200 text-sm font-bold flex items-center justify-center"
                        title="Borrar comentario"
                      >
                        <img src="/borrar.png" alt="Borrar" className="w-5 h-5" />
                      </button>
                    )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="pt-5 pb-6 border-t border-gray-800 bg-gray-900">
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleEnviar}>
            <input
              type="text"
              className="flex-1 border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={e => setNuevoComentario(e.target.value)}
              maxLength={MAX_LENGTH}
              required
              disabled={!usuario}
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto"
              disabled={enviando || !nuevoComentario.trim() || !usuario}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </form>
          {!usuario && (
            <div className="text-red-400 text-sm mt-2">
              Debes iniciar sesión para comentar.
            </div>
          )}
          {error && (
            <div className="text-red-400 text-sm mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
});

PostComments.displayName = "PostComments";

export default PostComments;
