import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../services/api";

export interface AsideNavBarProps {}

const AsideNavBar: React.FC<AsideNavBarProps> = React.memo(function AsideNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Verifica el token y obtiene el usuario
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      try {
        const response = await API.post("/auth/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoggedIn(!!response.data.user);
        setUser(response.data.user || null);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  // Detecta si es móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  }, []);

  const renderNavLinks = () => (
    <>
      <Link to="/" className="hover:text-pink-400 py-2 px-2 rounded transition-colors font-semibold">
        Inicio
      </Link>
      {isLoggedIn ? (
        <>
          <Link to="/user/profile" className="hover:text-pink-400 py-2 px-2 rounded transition-colors font-semibold">
            Perfil
          </Link>
          {(user?.rol_id === 2 || user?.rol_id === 3) && (
            <Link to="/manager" className="hover:text-pink-400 py-2 px-2 rounded transition-colors font-semibold">
              Panel de gestor
            </Link>
          )}
          {user?.rol_id === 2 && (
            <Link to="/admin" className="hover:text-pink-400 py-2 px-2 rounded transition-colors font-semibold">
              Administración
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="mt-4 text-red-400 hover:text-red-200 font-semibold py-2 px-2 rounded transition-colors"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <Link
          to="/auth/login"
          className="mt-4 text-pink-400 hover:text-pink-200 font-semibold py-2 px-2 rounded transition-colors"
        >
          Iniciar sesión
        </Link>
      )}
    </>
  );

  return (
    <>
      {isMobile ? (
        <header className="bg-gray-950 text-white w-full flex flex-col shadow z-30 fixed top-0 left-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="text-2xl font-extrabold tracking-tight text-pink-400">PicMeTogether</span>
            </Link>
            <button
              className="focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          {menuOpen && (
            <nav className="flex flex-col gap-2 px-6 py-4 bg-gray-950">
              {renderNavLinks()}
            </nav>
          )}
        </header>
      ) : (
        <aside className="bg-gray-950 text-white flex flex-col md:w-64 w-full md:h-screen h-auto md:fixed z-30">
          <div className="flex items-center justify-between px-6 py-5 md:py-8 md:px-4 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="text-2xl font-extrabold tracking-tight text-pink-400">PicMeTogether</span>
            </Link>
          </div>
          <nav className="flex-col gap-2 px-6 md:px-4 py-4 md:flex md:static">
            {renderNavLinks()}
          </nav>
        </aside>
      )}
    </>
  );
});

AsideNavBar.displayName = "AsideNavBar";

export default AsideNavBar;