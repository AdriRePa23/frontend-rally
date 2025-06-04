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
        // Mostrar solo galerías activas
        const activas = (Array.isArray(data) ? data : [data]).filter(
          (galeria) => galeria.estado === "activo"
        );
        setRallies(activas);
      } catch (error) {
        console.error("Error al obtener las galerías:", error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };
    fetchRallies();
  }, []);

  return (
    <div className="flex h-screen">
      <AsideNavBar />
      <main
        className="flex-1 bg-gray-100 p-6 overflow-y-auto md:ml-64"
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-6">Galerías disponibles</h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Cargando galerías...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rallies.length > 0 ? (
                rallies.map((galeria) => <RallyCard key={galeria.id} rally={galeria} />)
              ) : (
                <p>No hay galerías disponibles</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
