import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

// Tipado explícito y exportable para reutilización
export interface AsideNavBarProps {}

// Componente funcional puro y memoizado
const AsideNavBar: React.FC<AsideNavBarProps> = React.memo(function AsideNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.post("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.user) {
            setIsLoggedIn(true);
            setUser(response.data.user);
          }
        } catch {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Rally App</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:text-gray-300">
          Inicio
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/user/profile" className="hover:text-gray-300">
              Perfil
            </Link>
            <Link to="/rally/create" className="hover:text-gray-300">
              Crear Rally
            </Link>
            {(user?.rol_id === 2) && (
              <Link to="/manager" className="hover:text-gray-300">
                Panel Gestor
              </Link>
            )}
            {(user?.rol_id === 2 || user?.rol_id === 3) && (
              <Link to="/admin" className="hover:text-gray-300">
                Administración
              </Link>
            )}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth/login";
              }}
              className="mt-auto text-red-500 hover:text-red-300"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="mt-auto text-blue-500 hover:text-blue-300"
          >
            Iniciar sesión
          </Link>
        )}
      </nav>
    </aside>
  );
});

AsideNavBar.displayName = "AsideNavBar";

export default AsideNavBar;