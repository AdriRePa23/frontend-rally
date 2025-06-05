import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams } from "react-router-dom";
import { Rally } from "../../types";
import { Usuario } from "../../types/Usuario";
import EditRallyForm from "../EditRallyForm/EditRallyForm";

// Tipado explícito y exportable para reutilización
export interface RallyInfoProps {}

const RallyInfo: React.FC<RallyInfoProps> = React.memo(function RallyInfo() {
  const { id } = useParams<{ id: string }>();
  const [rally, setRally] = useState<Rally | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [creador, setCreador] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchRally = async () => {
      try {
        const response = await API.get(`/rallies/${id}`);
        setRally(response.data);
        if (response.data.creador_id) {
          try {
            const creadorRes = await API.get(`/usuarios/${response.data.creador_id}`);
            setCreador(creadorRes.data);
          } catch {}
        }
      } catch (err) {
        setError("No se pudo cargar el rally.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsuario = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.post("/auth/verify-token", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.user) setUsuario(res.data.user);
        } catch {}
      }
    };

    fetchRally();
    fetchUsuario();
  }, [id]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) return <div className="text-center py-8 text-white">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!rally) return null;

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta galería? Esta acción no se puede deshacer.")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await API.delete(`/rallies/${rally.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = "/";
    } catch {
      alert("No se pudo eliminar la galería.");
    }
  };

  return (
    <div className="w-full bg-gray-900 shadow-lg rounded-2xl mt-8 p-0 flex flex-col gap-0 text-white">
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-extrabold text-pink-400 break-words">{rally.nombre}</h1>
              {rally.estado === "pendiente" && (
                <span className="bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full text-sm shadow">
                  Galería pendiente de validación
                </span>
              )}
            </div>
            <p className="text-lg text-gray-200 mb-4">{rally.descripcion}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">Categorías: {rally.categorias}</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Fecha de creación: {formatDate(rally.fecha_inicio)}</span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Fecha fin: {formatDate(rally.fecha_fin)}</span>
              <span className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm font-semibold">Máx. fotos/usuario: {rally.cantidad_fotos_max}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mt-4">
            {creador && (
              <a href={`/usuarios/${creador.id}`} className="flex items-center gap-2 hover:underline">
                <img
                  src={creador.foto_perfil || "/logo.png"}
                  alt={`Foto de perfil de ${creador.nombre}`}
                  className="w-12 h-12 rounded-full border-2 border-pink-300 object-cover"
                />
                <span className="font-semibold text-pink-400 text-lg">{creador.nombre}</span>
              </a>
            )}
            <div className="flex gap-2 ml-auto">
              {(usuario && (usuario.id === rally.creador_id || usuario.rol_id === 2)) && (
                <button
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                  onClick={() => setShowEdit(true)}
                  style={{ minWidth: 180 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232a2.5 2.5 0 113.536 3.536L8.5 19.036l-4 1 1-4 10.268-10.268z" />
                  </svg>
                  Editar galería
                </button>
              )}
              {(usuario && (usuario.id === rally.creador_id || usuario.rol_id === 2 || usuario.rol_id === 3)) && (
                <button
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                  onClick={handleDelete}
                  style={{ minWidth: 180 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Borrar galería
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showEdit && rally && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-lg w-full relative text-white">
            <button onClick={() => setShowEdit(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-pink-400">Editar galería</h2>
            <EditRallyForm rally={rally} onClose={() => setShowEdit(false)} />
          </div>
        </div>
      )}
    </div>
  );
});

RallyInfo.displayName = "RallyInfo";

export default RallyInfo;
