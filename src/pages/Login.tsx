import { useEffect } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";

function Login() {
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.post("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.valid) {
            window.location.href = "/"; 
          }
        } catch (error) {
          console.error("Error al verificar el token:", error);
        }
      }
    };
    verifyToken();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar isLoggedIn={false} />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;
