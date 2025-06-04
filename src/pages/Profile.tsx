import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";
import ProfileInfo from "../components/ProfileInfo/ProfileInfo";
import BackButton from "../components/BackButton";
import UserPostCard from "../components/UserPostCard/UserPostCard";
import UserRallies from "../components/UserRallies/UserRallies";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [tab, setTab] = useState<"galerias" | "publicaciones">("publicaciones");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token && !id) {
        navigate("/login");
        return;
      }
      if (!id) {
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
          } else {
            setIsOwnProfile(true);
          }
        } catch (error) {
          navigate("/");
        }
      } else {
        setIsOwnProfile(false);
      }
    };
    verifyToken();
  }, [navigate, id]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      let userId = id;
      if (!userId) {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
          const res = await API.post(
            "/auth/verify-token",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          userId = res.data.user?.id;
        } catch {
          return;
        }
      }
      if (userId) {
        try {
          const postsRes = await API.get(`/publicaciones/usuario/${userId}`);
          setUserPosts(postsRes.data);
        } catch {
          setUserPosts([]);
        }
      }
    };
    if (tab === "publicaciones") {
      fetchUserPosts();
    }
  }, [tab, id]);

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto md:ml-64 pt-20 md:pt-0 w-full max-w-full">
        <div className="mb-4 flex items-center justify-between">
          <BackButton />
          {isOwnProfile && (
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-200"
              onClick={() => setShowEdit(true)}
            >
              Editar perfil
            </button>
          )}
        </div>
        <ProfileInfo />
        <div className="mt-8">
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-full font-bold text-lg transition-all ${
                tab === "publicaciones"
                  ? "bg-pink-600 text-white shadow"
                  : "bg-gray-900 text-pink-400 border border-pink-400"
              }`}
              onClick={() => setTab("publicaciones")}
            >
              Todas las publicaciones
            </button>
            <button
              className={`px-6 py-2 rounded-full font-bold text-lg transition-all ${
                tab === "galerias"
                  ? "bg-pink-600 text-white shadow"
                  : "bg-gray-900 text-pink-400 border border-pink-400"
              }`}
              onClick={() => setTab("galerias")}
            >
              Galerías creadas
            </button>
          </div>
          <div className="flex justify-center">
            {tab === "galerias" ? (
              <UserRallies userId={id} />
            ) : (
              <div className="w-full">
                <div
                  className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
                  style={{ maxWidth: 1400 }}
                >
                  {userPosts.length === 0 ? (
                    <p className="text-gray-400 text-center">
                      No tienes publicaciones.
                    </p>
                  ) : (
                    userPosts.map((post) => (
                      <UserPostCard
                        key={post.id}
                        id={post.id}
                        imagen={post.fotografia}
                        rally_id={post.rally_id}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-lg w-full relative">
              <button
                onClick={() => setShowEdit(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-pink-400">Editar perfil</h2>
              <EditProfileForm onClose={() => setShowEdit(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
