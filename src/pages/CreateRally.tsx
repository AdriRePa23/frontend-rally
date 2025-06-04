import { useEffect } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import { useNavigate } from "react-router-dom";
import CreateRallyForm from "../components/CreateRallyForm/CreateRallyForm";
import BackButton from "../components/BackButton";

const CreateRally: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Si no hay token, redirige al login
        navigate("/login");
        return;
      }
      try {
        const response = await API.post(
          "/auth/verify-token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Respuesta del backend:", response.data);
        if (!response.data.user) {
          // Si el token no es válido, redirige al login
          console.log("Token inválido, redirigiendo...");
          navigate("/");
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        navigate("/");
      }
    };
    verifyToken();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto md:ml-64 pt-20 md:pt-0 flex flex-col items-center">
        <div className="mb-4 w-full max-w-lg">
          <BackButton />
        </div>
        <div className="w-full max-w-lg">
          <CreateRallyForm />
        </div>
      </main>
    </div>
  );
};

export default CreateRally;
