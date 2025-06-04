import { useEffect, useState } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import RallyCard from "../components/RallyCard/RallyCard";
import { Rally } from "../types";

const Home: React.FC = () => {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main
        className="flex-1 bg-gray-950 p-6 overflow-y-auto md:ml-64 pt-20 md:pt-0"
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-6 text-pink-400">
            Galerías disponibles
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-400">Cargando galerías...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rallies.length > 0 ? (
                rallies.map((rally) => <RallyCard key={rally.id} rally={rally} />)
              ) : (
                <p className="text-gray-400">No hay galerías disponibles</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
