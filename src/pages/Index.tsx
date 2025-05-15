import { useEffect, useState } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import RallyCard from "../components/RallyCard/RallyCard";
import { Rally } from "../types";

const Home: React.FC = () => {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchRallies = async () => {
      try {
        const { data } = await API.get("/rallies/card");
        setRallies(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error al obtener los rallies:", error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };
    fetchRallies();
  }, []);

  return (
    <div className="flex h-screen">
      <AsideNavBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">Rallies Disponibles</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando rallies...</p> // Indicador de carga
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rallies.length > 0 ? (
              rallies.map((rally) => <RallyCard key={rally.id} rally={rally} />)
            ) : (
              <p>No hay rallies disponibles</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
