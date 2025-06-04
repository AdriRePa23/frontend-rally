import React, { useEffect, useState } from "react";
import API from "../../services/api";

// Tipado explícito y exportable para reutilización
export interface UserRalliesProps {
  userId?: string;
}

// Componente funcional puro y memoizado
const UserRallies: React.FC<UserRalliesProps> = React.memo(function UserRallies({ userId }) {
  const [rallies, setRallies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchRallies = async () => {
      setLoading(true);
      setError(null);
      try {
        let uid = userId;
        let owner = false;
        let currentUserId = null;
        const token = localStorage.getItem("token");
        if (!uid) {
          if (!token) {
            setError("No autenticado.");
            setLoading(false);
            return;
          }
          const res = await API.post(
            "/auth/verify-token",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          uid = res.data.user?.id;
          currentUserId = res.data.user?.id;
        } else if (token) {
          const res = await API.post(
            "/auth/verify-token",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          currentUserId = res.data.user?.id;
        }
        if (!uid) {
          setError("No se pudo obtener el usuario.");
          setLoading(false);
          return;
        }
        if (currentUserId && String(currentUserId) === String(uid)) {
          owner = true;
        }
        setIsOwner(owner);

        const ralliesRes = await API.get(`/rallies/usuario/${uid}`);
        setRallies(ralliesRes.data);
      } catch {
        setError("No se pudieron cargar los rallies.");
      } finally {
        setLoading(false);
      }
    };
    fetchRallies();
  }, [userId]);

  if (loading)
    return <div className="text-center py-8 text-white">Cargando galerías...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;
  if (rallies.length === 0)
    return <p className="text-gray-400 text-center">No has creado ninguna galería.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 w-full justify-items-center">
      {rallies
        .filter((rally) =>
          isOwner
            ? true
            : rally.estado === "activo"
        )
        .map((rally) => {
          let estadoLabel = "";
          if (rally.estado === "pendiente") {
            estadoLabel = "Pendiente";
          } else if (
            rally.estado === "activo" &&
            new Date(rally.fecha_fin) < new Date()
          ) {
            estadoLabel = "Finalizado";
          } else if (rally.estado === "activo") {
            estadoLabel = "Activo";
          }
          const puedeAcceder = isOwner || rally.estado === "activo";
          return (
            <a
              key={rally.id}
              href={puedeAcceder ? `/rallies/${rally.id}` : undefined}
              className={`bg-gradient-to-br from-pink-900 via-gray-900 to-pink-800 shadow-xl rounded-2xl p-6 w-full max-w-md flex flex-col justify-between hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out ${!puedeAcceder ? "pointer-events-none opacity-60" : ""}`}
              tabIndex={puedeAcceder ? 0 : -1}
              aria-disabled={!puedeAcceder}
            >
              <h3 className="text-2xl font-extrabold text-pink-400 mb-2">
                {rally.nombre}
              </h3>
              <p className="text-base text-gray-200 mb-4">{rally.descripcion}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Categorías: {rally.categorias}
                </span>
                <span className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                  Máx. fotos/usuario: {rally.cantidad_fotos_max}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-auto ${
                estadoLabel === "Activo"
                  ? "bg-green-100 text-green-800"
                  : estadoLabel === "Finalizado"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {estadoLabel}
              </span>
            </a>
          );
        })}
    </div>
  );
});

UserRallies.displayName = "UserRallies";

export default UserRallies;
