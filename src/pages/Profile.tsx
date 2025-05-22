import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import ProfileInfo from "../components/ProfileInfo/ProfileInfo";
import BackButton from "../components/BackButton";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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
        if (!response.data.user) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };
    verifyToken();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto w-full max-w-full">
        <div className="mb-4">
          <BackButton />
        </div>
        <ProfileInfo />
      </main>
    </div>
  );
};

export default Profile;
