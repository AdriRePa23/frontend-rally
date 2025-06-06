import React, { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

interface UserAdmin {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  foto_perfil: string;
}

const UserAdminTable: React.FC = () => {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAllowed(false);
          setLoading(false);
          return;
        }
        const verify = await API.post(
          "/auth/verify-token",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!verify.data.user || verify.data.user.rol_id !== 2) {
          setIsAllowed(false);
          setLoading(false);
          return;
        }
        setIsAllowed(true);
        const res = await API.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch {
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
      try {
        const token = localStorage.getItem("token");
        await API.delete(`/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setModalOpen(false);
        setSelectedUser(null);
      } catch {
        alert("No se pudo eliminar el usuario.");
      }
    },
    [setUsers, setModalOpen, setSelectedUser]
  );

  const handleSave = useCallback(
    async (user: UserAdmin) => {
      try {
        const token = localStorage.getItem("token");
        await API.put(
          `/usuarios/${user.id}`,
          {
            nombre: user.nombre,
            email: user.email,
            rol_id: user.rol_id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, ...user } : u))
        );
        setModalOpen(false);
        setSelectedUser(null);
      } catch {
        alert("No se pudo actualizar el usuario.");
      }
    },
    [setUsers, setModalOpen, setSelectedUser]
  );

  if (isAllowed === false) {
    return (
      <div className="text-center py-8 text-red-500 font-bold">
        Acceso denegado. Solo los administradores pueden ver esta sección.
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="text-center py-4 text-white">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-4 bg-gray-900 rounded-lg shadow p-3"
            >
              <img
                src={u.foto_perfil}
                alt={u.nombre}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="font-semibold text-pink-400 flex-1">
                {u.nombre}
              </span>
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setModalOpen(true);
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded text-sm"
              >
                Ver / Editar
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full relative text-white">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              Usuario #{selectedUser.id}
            </h2>
            <div className="flex flex-col gap-3">
              <img
                src={selectedUser.foto_perfil}
                alt={selectedUser.nombre}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              <label className="font-semibold text-sm">Nombre:</label>
              <input
                type="text"
                value={selectedUser.nombre}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, nombre: e.target.value })
                }
                className="border rounded px-3 py-2 bg-gray-800 text-white"
              />
              <label className="font-semibold text-sm">Email:</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="border rounded px-3 py-2 bg-gray-800 text-white"
              />
              <label className="font-semibold text-sm">Rol:</label>
              <select
                value={selectedUser.rol_id}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    rol_id: Number(e.target.value),
                  })
                }
                className="border rounded px-3 py-2 bg-gray-800 text-white"
              >
                <option value={1}>Usuario</option>
                <option value={3}>Gestor</option>
                <option value={2}>Administrador</option>
              </select>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleSave(selectedUser)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold flex-1"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleDelete(selectedUser.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold flex-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdminTable;
