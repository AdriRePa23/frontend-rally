import { useEffect } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.post("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Respuesta del backend:", response.data); 
          if (response.data.user) {
            console.log("Token válido, redirigiendo...");
            navigate("/");
          }
        } catch (error) {
          console.error("Error al verificar el token:", error);
        }
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
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

export default Login;
