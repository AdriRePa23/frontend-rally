import { useEffect } from "react";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import { useNavigate } from "react-router-dom"; // Para redirigir al usuario
import BackButton from "../components/BackButton";

const Register: React.FC = () => {
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.post("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.valid) {
            navigate("/"); // Redirige al usuario a la página principal si el token es válido
          }
        } catch (error) {
          console.error("Error al verificar el token:", error);
        }
      }
    };
    verifyToken();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <RegisterForm />
      </main>
    </div>
  );
};

export default Register;
