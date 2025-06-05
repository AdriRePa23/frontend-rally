import { useEffect, useState } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import RallyCard from "../components/RallyCard/RallyCard";
import { Rally } from "../types";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchRallies = async () => {
      try {
        const { data } = await API.get("/rallies/card");
        const activas = (Array.isArray(data) ? data : [data]).filter(
          (galeria) => galeria.estado === "activo"
        );
        setRallies(activas);
      } catch (error) {
        console.error("Error al obtener las galerías:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRallies();
  }, []);

  // Filtrado por nombre de galería
  const filteredRallies = rallies.filter((galeria) =>
    galeria.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main
        className="flex-1 bg-gray-950 p-6 overflow-y-auto w-full md:ml-64 pt-24 md:pt-0"
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto grid grid-rows-[auto_1fr] gap-6 mt-6" >
          {/* Fila 1: Título, buscador y botón */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <h2 className="text-3xl font-bold text-pink-400 col-span-1 md:col-span-1">
              Galerías disponibles
            </h2>
            <input
              type="text"
              placeholder="Buscar galería por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 w-full md:col-span-1"
            />
            <Link
              to="/rally/create"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-200 text-center w-full md:w-auto md:justify-self-end"
            >
              Crear galería
            </Link>
          </div>
          {/* Fila 2: Grid de galerías */}
          <div>
            {isLoading ? (
              <p className="text-center text-gray-400">Cargando galerías...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRallies.length > 0 ? (
                  filteredRallies.map((rally) => (
                    <RallyCard key={rally.id} rally={rally} />
                  ))
                ) : (
                  <p className="text-gray-400">No hay galerías disponibles</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
