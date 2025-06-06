import React, { useState, useEffect, useCallback, DragEvent } from "react";
import API from "../../services/api";

export interface EditProfileFormProps {
  onClose: () => void;
}

const MAX_IMG_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EditProfileForm: React.FC<EditProfileFormProps> = React.memo(function EditProfileForm({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.post("/auth/verify-token", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = res.data.user?.id;
        if (userId) {
          const userRes = await API.get(`/usuarios/${userId}/private`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNombre(userRes.data.nombre || "");
          setPreview(userRes.data.foto_perfil || "");
        }
      } catch {}
    };
    fetchUser();
  }, []);

  const validateImage = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Solo se permiten imágenes JPG, PNG o WEBP.";
    }
    if (file.size > MAX_IMG_SIZE) {
      return "La imagen no puede superar los 5MB.";
    }
    return null;
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImage(file);
      if (validation) {
        setError(validation);
        return;
      }
      setFotoPerfil(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateImage(file);
      if (validation) {
        setError(validation);
        return;
      }
      setFotoPerfil(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado.");
      setLoading(false);
      return;
    }
    try {
      const res = await API.post("/auth/verify-token", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = res.data.user?.id;
      if (!userId) throw new Error("No se pudo obtener el usuario.");
      const formData = new FormData();
      formData.append("nombre", nombre);
      if (fotoPerfil) formData.append("foto_perfil", fotoPerfil);
      await API.put(`/usuarios/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
      window.location.href = window.location.href;
    } catch {
      setError("No se pudo actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <label className="font-semibold text-white">Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        className="border rounded px-3 py-2 bg-gray-900 text-white"
        maxLength={255}
        required
      />
      <label className="font-semibold text-white">Foto de perfil:</label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${dragActive ? "border-pink-500 bg-pink-50" : "border-gray-700 bg-gray-800"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fotoPerfilInput")?.click()}
      >
        <input
          id="fotoPerfilInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {preview ? (
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 flex items-center justify-center bg-white">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ aspectRatio: "1 / 1" }}
            />
          </div>
        ) : (
          <span className="text-gray-500">Arrastra una imagen aquí o haz clic para seleccionar</span>
        )}
      </div>
      <button
        type="submit"
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
});

EditProfileForm.displayName = "EditProfileForm";

export default EditProfileForm;