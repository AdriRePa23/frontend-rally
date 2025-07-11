import React, { useState, useCallback } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export interface PostFormProps {
  rallyId: number;
  onSuccess?: () => void;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/bmp",
  "image/gif"
];
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_DESC = 500;

const PostForm: React.FC<PostFormProps> = React.memo(function PostForm({ rallyId, onSuccess }) {
  const [imagen, setImagen] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = (img: File | null, desc: string): string | null => {
    if (!img) return "Debes seleccionar una imagen.";
    if (!ALLOWED_TYPES.includes(img.type)) return "La imagen debe ser JPG, JPEG, PNG, WEBP, GIF o BMP.";
    if (img.size > MAX_SIZE) return "La imagen no puede superar los 10MB.";
    if (!desc.trim()) return "La descripción es obligatoria.";
    if (desc.length > MAX_DESC) return "La descripción no puede superar los 500 caracteres.";
    return null;
  };

  const handleImagenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImagen(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validation = validate(imagen, descripcion);
    if (validation) {
      setError(validation);
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
      formData.append("fotografia", imagen!);
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
      const apiMsg = err.response?.data?.message;
      if (apiMsg?.includes("No puedes subir más de") || apiMsg === "No puedes subir más de X fotos a este rally.") {
        setError("No puedes subir más fotos a este rally.");
      } else if (apiMsg?.includes("La imagen y el ID del rally son obligatorios")) {
        setError("La imagen y el ID del rally son obligatorios.");
      } else if (
        apiMsg?.includes("Solo se permiten imágenes JPG") ||
        apiMsg?.includes("Solo se permiten imágenes PNG") ||
        apiMsg?.includes("Solo se permiten imágenes WEBP") ||
        apiMsg?.includes("Solo se permiten imágenes") ||
        (apiMsg?.toLowerCase().includes("imagen") && apiMsg?.toLowerCase().includes("permit"))
      ) {
        setError("La imagen debe ser JPG, JPEG, PNG, WEBP o BMP.");
      } else if (
        apiMsg?.includes("La imagen no puede superar los 5MB") ||
        apiMsg?.includes("La imagen no puede superar los 10MB")
      ) {
        setError("La imagen no puede superar los 10MB.");
      } else if (apiMsg?.includes("Rally no encontrado")) {
        setError("El rally no existe.");
      } else if (apiMsg?.includes("Error al crear la publicación")) {
        setError("Error al crear la publicación.");
      } else if (apiMsg?.toLowerCase().includes("token") && apiMsg?.toLowerCase().includes("expir")) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      } else {
        setError(apiMsg || "Error al crear la publicación.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [imagen, descripcion, rallyId, onSuccess, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 shadow-2xl rounded-2xl px-12 pt-10 pb-12 mb-8 max-w-2xl mx-auto mt-12"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-pink-400">Nueva publicación</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-6">
        <label className="block text-white text-lg font-bold mb-2">Fotografía:</label>
        <div
          className={`w-full border-2 border-gray-700 bg-gray-800 border-dashed rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-200`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {imagen ? (
            <img src={URL.createObjectURL(imagen)} alt="Previsualización" className="max-h-72 mb-2 rounded-xl object-contain" />
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1z" /></svg>
              <span className="text-gray-500 text-lg">Arrastra una imagen aquí o haz clic para seleccionar</span>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleImagenChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-white text-lg font-bold mb-2">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="shadow appearance-none border rounded-xl w-full py-3 px-4 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline text-base"
          rows={5}
          required
        />
      </div>
      <button
        type="submit"
        className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full text-lg ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Publicar"}
      </button>
    </form>
  );
});

PostForm.displayName = "PostForm";

export default PostForm;
