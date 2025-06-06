import React, { useState, useCallback } from "react";
import API from "../../services/api";

export interface EditRallyFormProps {
  rally: any;
  onClose: () => void;
}

const EditRallyForm: React.FC<EditRallyFormProps> = React.memo(function EditRallyForm({ rally, onClose }) {
  const [nombre, setNombre] = useState(rally.nombre || "");
  const [descripcion, setDescripcion] = useState(rally.descripcion || "");
  const [fechaFin, setFechaFin] = useState(rally.fecha_fin ? rally.fecha_fin.slice(0, 10) : "");
  const [categorias, setCategorias] = useState(rally.categorias || "");
  const [cantidadFotosMax, setCantidadFotosMax] = useState(rally.cantidad_fotos_max || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!nombre || !fechaFin || !cantidadFotosMax) {
      return "Todos los campos son obligatorios.";
    }
    if (nombre.length > 255) return "El nombre no puede tener más de 255 caracteres.";
    if (descripcion.length > 500) return "La descripción no puede tener más de 500 caracteres.";
    if (categorias.length > 255) return "Las categorías no pueden tener más de 255 caracteres.";
    if (isNaN(Number(cantidadFotosMax)) || Number(cantidadFotosMax) < 1) return "El número máximo de fotos debe ser un entero positivo.";
    if (!/\d{4}-\d{2}-\d{2}/.test(fechaFin) || isNaN(Date.parse(fechaFin))) return "La fecha de fin debe ser válida.";
    return null;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No autenticado.");
        setLoading(false);
        return;
      }
      await API.put(`/rallies/${rally.id}`, {
        nombre,
        descripcion,
        fecha_fin: fechaFin,
        categorias,
        cantidad_fotos_max: Number(cantidadFotosMax),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
      window.location.reload();
    } catch (err: any) {
      const apiMsg = err.response?.data?.message;
      setError(apiMsg || "No se pudo actualizar el rally.");
    } finally {
      setLoading(false);
    }
  }, [nombre, descripcion, fechaFin, categorias, cantidadFotosMax, rally.id, onClose]);

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
      <label className="font-semibold text-white">Descripción:</label>
      <textarea
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        className="border rounded px-3 py-2 bg-gray-900 text-white"
        maxLength={500}
        required
      />
      <label className="font-semibold text-white">Fecha fin:</label>
      <input
        type="date"
        value={fechaFin}
        onChange={e => setFechaFin(e.target.value)}
        className="border rounded px-3 py-2 bg-gray-900 text-white"
        required
      />
      <label className="font-semibold text-white">Categorías:</label>
      <input
        type="text"
        value={categorias}
        onChange={e => setCategorias(e.target.value)}
        className="border rounded px-3 py-2 bg-gray-900 text-white"
        maxLength={255}
        required
      />
      <label className="font-semibold text-white">Máx. fotos por usuario:</label>
      <input
        type="number"
        value={cantidadFotosMax}
        onChange={e => setCantidadFotosMax(e.target.value)}
        min={1}
        className="border rounded px-3 py-2 bg-gray-900 text-white"
        required
      />
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

EditRallyForm.displayName = "EditRallyForm";

export default EditRallyForm;
