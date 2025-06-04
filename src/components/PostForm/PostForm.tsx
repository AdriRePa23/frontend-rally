import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

// Tipado explícito y exportable para reutilización
export interface PostFormProps {
  rallyId: number;
  onSuccess?: () => void;
}

// Componente funcional puro y memoizado
const PostForm: React.FC<PostFormProps> = React.memo(function PostForm({ rallyId, onSuccess }) {
  const [imagen, setImagen] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImagen(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!imagen) {
      setError("Debes seleccionar una imagen.");
      return;
    }
    if (
      imagen.type !== "image/jpeg" &&
      imagen.type !== "image/png" &&
      imagen.type !== "image/webp"
    ) {
      setError("La imagen debe ser JPG, PNG o WEBP.");
      return;
    }
    if (imagen.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB.");
      return;
    }
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    if (descripcion.length > 500) {
      setError("La descripción no puede superar los 500 caracteres.");
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
      setImagen(null);
      setDescripcion("");
      if (onSuccess) onSuccess();
      navigate(`/rallies/${rallyId}`);
    } catch (err: any) {
      // Manejo de mensajes de error específicos de la API
      const apiMsg = err.response?.data?.message;
      if (apiMsg === "No puedes subir más de X fotos a este rally.") {
        setError("No puedes subir más fotos a este rally.");
      } else if (apiMsg === "La imagen y el ID del rally son obligatorios") {
        setError("La imagen y el ID del rally son obligatorios.");
      } else if (apiMsg === "Solo se permiten imágenes JPG, PNG o WEBP") {
        setError("La imagen debe ser JPG, PNG o WEBP.");
      } else if (apiMsg === "La imagen no puede superar los 5MB") {
        setError("La imagen no puede superar los 5MB.");
      } else if (apiMsg === "Rally no encontrado") {
        setError("El rally no existe.");
      } else if (apiMsg === "Error al crear la publicación") {
        setError("Error al crear la publicación.");
      } else {
        setError(apiMsg || "Error al crear la publicación.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-400">Nueva publicación</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">Fotografía:</label>
        <div
          className={`w-full border-2 ${"border-gray-700 bg-gray-800"} border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-200`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {imagen ? (
            <img src={URL.createObjectURL(imagen)} alt="Previsualización" className="max-h-48 mb-2 rounded-lg object-contain" />
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1z" /></svg>
              <span className="text-gray-500">Arrastra una imagen aquí o haz clic para seleccionar</span>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Publicar"}
      </button>
    </form>
  );
});

PostForm.displayName = "PostForm";

export default PostForm;
