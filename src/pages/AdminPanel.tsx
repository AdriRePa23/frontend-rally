import React, { useEffect, useState } from "react";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import UserAdminTable from "../components/UserAdminTable/UserAdminTable";
import RallyAdminTable from "../components/RallyAdminTable/RallyAdminTable";

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

  if (loading) return <div className="flex h-screen bg-gray-950"><AsideNavBar /><main className="flex-1 flex items-center justify-center text-white">Cargando...</main></div>;
  if (!isAllowed) return <div className="flex h-screen bg-gray-950"><AsideNavBar /><main className="flex-1 flex items-center justify-center text-red-500">Acceso denegado</main></div>;

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 p-8 bg-gray-950 overflow-y-auto md:ml-64 pt-20 md:pt-0">
        <h1 className="text-3xl font-bold mb-6 text-pink-400">Panel de Administración</h1>
        <p className="mb-4 text-white">Bienvenido, {user?.nombre}.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-pink-400">Gestión de usuarios</h2>
            <p className="text-gray-400 mb-2">Ver, editar y eliminar usuarios, gestores y administradores.</p>
            <UserAdminTable />
          </div>
          <div className="bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-pink-400">Gestión de galerías</h2>
            <p className="text-gray-400 mb-2">Ver, editar y eliminar galerías.</p>
            <RallyAdminTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
