import React, { useEffect, useState } from "react";
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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
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
  };

  const handleSave = async (user: UserAdmin) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/usuarios/${user.id}`,
        {
          nombre: user.nombre,
          email: user.email,
          rol_id: user.rol_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      );
      setModalOpen(false);
      setSelectedUser(null);
    } catch {
      alert("No se pudo actualizar el usuario.");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-4">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-4 bg-white rounded-lg shadow p-3"
            >
              <img
                src={u.foto_perfil}
                alt={u.nombre}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="font-semibold text-blue-900 flex-1">
                {u.nombre}
              </span>
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setModalOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
              >
                Ver / Editar
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
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
                className="border rounded px-3 py-2"
              />
              <label className="font-semibold text-sm">Email:</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="border rounded px-3 py-2"
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
                className="border rounded px-3 py-2"
              >
                <option value={1}>Usuario</option>
                <option value={2}>Gestor</option>
                <option value={3}>Administrador</option>
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
