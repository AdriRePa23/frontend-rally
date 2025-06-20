import { useEffect, useCallback } from "react";
import API from "../services/api";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm/PostForm";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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
        <div className="w-full max-w-lg">
          {id ? (
            <PostForm rallyId={parseInt(id, 10)} />
          ) : (
            <div className="text-center text-red-500">
              No se encontró la galería.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
