import { useEffect, useCallback } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import { useNavigate } from "react-router-dom";
import CreateRallyForm from "../components/CreateRallyForm/CreateRallyForm";

const CreateRally: React.FC = () => {
  const navigate = useNavigate();

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    try {
      const response = await API.post(
        "/auth/verify-token",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.user) {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto md:ml-64 pt-20 md:pt-0 flex flex-col items-center">
        <div className="mb-4 w-full max-w-lg"></div>
        <div className="w-full max-w-lg">
          <CreateRallyForm />
        </div>
      </main>
    </div>
  );
};

export default CreateRally;
