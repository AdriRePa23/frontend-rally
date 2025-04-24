import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { Rally } from "../types";

const Home: React.FC = () => {
    const [rallies, setRallies] = useState<Rally[]>([]);

    useEffect(() => {
        const fetchRallies = async () => {
            try {
                const { data } = await API.get("/rallies");
                setRallies(data);
            } catch (error) {
                console.error("Error al obtener los rallies:", error);
            }
        };
        fetchRallies();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Barra lateral */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-6">Rally App</h1>
                <nav className="flex flex-col gap-4">
                    <Link to="/" className="hover:text-gray-300">
                        Inicio
                    </Link>
                    <Link to="/profile" className="hover:text-gray-300">
                        Perfil
                    </Link>
                    <Link to="/create-rally" className="hover:text-gray-300">
                        Crear Rally
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}
                        className="mt-auto text-red-500 hover:text-red-300"
                    >
                        Cerrar sesión
                    </button>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6">Rallies Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rallies.map((rally) => (
                        <div
                            key={rally.id}
                            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold">{rally.nombre}</h3>
                            <p className="text-gray-600">{rally.descripcion}</p>
                            <Link
                                to={`/rallies/${rally.id}`}
                                className="text-blue-500 hover:underline mt-4 block"
                            >
                                Ver publicaciones
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;