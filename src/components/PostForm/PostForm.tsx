import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

interface PostFormProps {
  rallyId: number;
  onSuccess?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ rallyId, onSuccess }) => {
  const [imagen, setImagen] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!imagen) {
      setError("Debes seleccionar una imagen.");
      return;
    }
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token de usuario. Inicia sesión.");
        setIsLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("fotografia", imagen);
      formData.append("descripcion", descripcion);
      formData.append("rally_id", rallyId.toString());
      await API.post("/publicaciones", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("¡Publicación creada correctamente!");
      setImagen(null);
      setDescripcion("");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        navigate(`/rallies/${rallyId}`);
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear la publicación.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Nueva publicación</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Fotografía:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Publicar"}
      </button>
    </form>
  );
};

export default PostForm;
