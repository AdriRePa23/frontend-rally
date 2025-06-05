import React, { useEffect, useState } from "react";
import API from "../../services/api";
import PostComments from "../PostComments/PostComments";

// Tipado explícito y exportable para reutilización
export interface PostMainProps {
  fotografia: string;
  creador: {
    nombre: string;
    foto_perfil: string;
    id?: number;
  };
  descripcion?: string;
  votos: number;
  publicacionId?: number;
  usuarioId?: number;
  estado?: string;
}

// Componente funcional puro y memoizado
const PostMain: React.FC<PostMainProps> = React.memo(function PostMain({
  fotografia,
  creador,
  descripcion,
  votos,
  publicacionId,
  estado,
}) {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.post(
            "/auth/verify-token",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsuario(res.data.user || null);
        } catch {
          setUsuario(null);
        }
      }
    };
    fetchUsuario();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token || !publicacionId) return;
      await API.delete(`/publicaciones/${publicacionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = "/";
    } catch {
      alert("No se pudo eliminar la publicación.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-8">
      {/* Izquierda: Imagen y detalles */}
      <div className="flex-1 flex flex-col">
        <div className="relative w-full flex justify-center bg-gray-900 rounded-t-xl">
          {usuario &&
            creador &&
            typeof creador.id !== "undefined" &&
            typeof usuario.id !== "undefined" &&
            (Number(usuario.id) === Number(creador.id) ||
              usuario.rol_id === 2 ||
              usuario.rol_id === 3) &&
            publicacionId && (
              <button
                onClick={handleDelete}
                type="button"
                className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-red-400 rounded-full p-2 shadow transition z-10 flex items-center justify-center"
                title="Eliminar publicación"
              >
                <img src="/borrar.png" alt="Borrar" className="w-7 h-7" />
              </button>
            )}
          <img
            src={fotografia}
            alt="Publicación"
            className="w-full max-h-[600px] object-contain rounded-t-xl bg-gray-900"
          />
          {estado === "pendiente" && (
            <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full text-xs shadow z-20">
              Pendiente de validación
            </span>
          )}
        </div>
        <div className="w-full px-8 py-6 bg-gray-900 border-t border-gray-800 flex flex-col gap-4 rounded-b-xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <img
                src={creador.foto_perfil}
                alt={creador.nombre}
                className="w-12 h-12 rounded-full border border-gray-700 shadow-lg"
              />
              <span className="font-semibold text-lg text-pink-400">
                {creador.nombre}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-10 h-10 text-pink-500"
              >
                <path d="M12.62 20.84a1.5 1.5 0 0 1-1.24 0C7.1 18.7 2 14.92 2 10.36A5.37 5.37 0 0 1 7.36 5a5.13 5.13 0 0 1 4.64 2.88A5.13 5.13 0 0 1 16.64 5a5.37 5.37 0 0 1 4.64 5.36c0 4.56-5.1 8.34-9.38 10.48Z" />
              </svg>
              <span className="text-lg font-bold text-pink-400">{votos}</span>
            </div>
          </div>
          {descripcion && (
            <div className="text-pink-100 text-base break-words">
              {descripcion}
            </div>
          )}
        </div>
      </div>
      {/* Derecha: Comentarios */}
      {publicacionId && (
        <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
          <PostComments publicacionId={publicacionId} />
        </div>
      )}
    </div>
  );
});

PostMain.displayName = "PostMain";

export default PostMain;
