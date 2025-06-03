import React, { useState } from "react";
import API from "../../services/api";

// Tipado explícito y exportable para reutilización
export interface EditRallyFormProps {
  rally: any;
  onClose: () => void;
}

// Componente funcional puro y memoizado
const EditRallyForm: React.FC<EditRallyFormProps> = React.memo(function EditRallyForm({ rally, onClose }) {
  const [nombre, setNombre] = useState(rally.nombre || "");
  const [descripcion, setDescripcion] = useState(rally.descripcion || "");
  const [fechaFin, setFechaFin] = useState(rally.fecha_fin ? rally.fecha_fin.slice(0, 10) : "");
  const [categorias, setCategorias] = useState(rally.categorias || "");
  const [cantidadFotosMax, setCantidadFotosMax] = useState(rally.cantidad_fotos_max || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!nombre || !fechaFin || !cantidadFotosMax) {
      setError("Todos los campos son obligatorios.");
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
      setError("No se pudo actualizar el rally.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <label className="font-semibold">Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        className="border rounded px-3 py-2"
        maxLength={255}
        required
      />
      <label className="font-semibold">Descripción:</label>
      <textarea
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        className="border rounded px-3 py-2"
        maxLength={500}
        required
      />
      <label className="font-semibold">Fecha fin:</label>
      <input
        type="date"
        value={fechaFin}
        onChange={e => setFechaFin(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <label className="font-semibold">Categorías:</label>
      <input
        type="text"
        value={categorias}
        onChange={e => setCategorias(e.target.value)}
        className="border rounded px-3 py-2"
        maxLength={255}
        required
      />
      <label className="font-semibold">Máx. fotos por usuario:</label>
      <input
        type="number"
        value={cantidadFotosMax}
        onChange={e => setCantidadFotosMax(e.target.value)}
        min={1}
        className="border rounded px-3 py-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
});

EditRallyForm.displayName = "EditRallyForm";

export default EditRallyForm;
