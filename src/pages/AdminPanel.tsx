import React, { useEffect, useState } from "react";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import UserAdminTable from "../components/UserAdminTable/UserAdminTable";

const AdminPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }
      try {
        const res = await API.post("/auth/verify-token", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        if (res.data.user && (res.data.user.rol_id === 2 || res.data.user.rol_id === 3)) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch {
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, [navigate]);

  if (loading) return <div className="flex h-screen"><AsideNavBar /><main className="flex-1 flex items-center justify-center">Cargando...</main></div>;
  if (!isAllowed) return <div className="flex h-screen"><AsideNavBar /><main className="flex-1 flex items-center justify-center text-red-500">Acceso denegado</main></div>;

  return (
    <div className="flex h-screen">
      <AsideNavBar />
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <p className="mb-4">Bienvenido, {user?.nombre}.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2">Gestión de usuarios</h2>
            <p className="text-gray-600 mb-2">Ver, editar y eliminar usuarios, gestores y administradores.</p>
            <UserAdminTable />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2">Gestión de rallies</h2>
            <p className="text-gray-600 mb-2">Ver, editar y eliminar rallies.</p>
            {/* Aquí puedes añadir enlaces o componentes para gestionar rallies */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
