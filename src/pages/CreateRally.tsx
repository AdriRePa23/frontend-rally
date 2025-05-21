import { useEffect, useState } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import { useNavigate } from "react-router-dom";
import CreateRallyForm from "../components/CreateRallyForm/CreateRallyForm";

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
        const response = await API.post("/auth/verify-token", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    <div className="flex h-screen">
      <AsideNavBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <CreateRallyForm />
        
      </main>
    </div>
  );
};

export default CreateRally;
