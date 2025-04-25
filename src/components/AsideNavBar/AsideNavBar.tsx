import { Link } from "react-router-dom";

function AsideNavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">Rally App</h1>
            <nav className="flex flex-col gap-4">
                <Link to="/" className="hover:text-gray-300">
                    Inicio
                </Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile" className="hover:text-gray-300">
                            Perfil
                        </Link>
                        <Link to="/create-rally" className="hover:text-gray-300">
                            Crear Rally
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token"); // Elimina el token
                                window.location.href = "/login"; // Redirige al login
                            }}
                            className="mt-auto text-red-500 hover:text-red-300"
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="mt-auto text-blue-500 hover:text-blue-300"
                    >
                        Iniciar sesión
                    </Link>
                )}
            </nav>
        </aside>
    );
}

export default AsideNavBar;