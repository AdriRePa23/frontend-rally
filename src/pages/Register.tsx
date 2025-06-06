import { useEffect, useCallback } from "react";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await API.post(
          "/auth/verify-token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.valid) {
          navigate("/");
        }
      } catch {}
    }
  }, [navigate]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto md:ml-64 pt-20 md:pt-0 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
};

export default Register;
