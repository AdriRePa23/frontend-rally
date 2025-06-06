import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

function CreateRallyForm() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fechaFin: '',
    categorias: '',
    maxFotosPorUsuario: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
    setIsLoading(true);

    const errors: { [key: string]: string } = {};
    if (!form.nombre || form.nombre.length > 255) {
      errors.nombre = 'El nombre es obligatorio y debe tener un máximo de 255 caracteres.';
    }
    if (form.descripcion && form.descripcion.length > 500) {
      errors.descripcion = 'La descripción debe tener un máximo de 500 caracteres.';
    }
    if (!form.fechaFin || isNaN(Date.parse(form.fechaFin))) {
      errors.fechaFin = 'La fecha de fin es obligatoria y debe ser válida.';
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const fechaFinDate = new Date(form.fechaFin);
      if (fechaFinDate <= today) {
        errors.fechaFin = 'La fecha de fin debe ser mayor que la fecha de inicio (hoy).';
      }
    }
    if (form.categorias && form.categorias.length > 255) {
      errors.categorias = 'Las categorías deben tener un máximo de 255 caracteres.';
    }
    if (
      !form.maxFotosPorUsuario ||
      isNaN(Number(form.maxFotosPorUsuario)) ||
      !Number.isInteger(Number(form.maxFotosPorUsuario)) ||
      Number(form.maxFotosPorUsuario) < 1
    ) {
      errors.maxFotosPorUsuario = 'La cantidad máxima de fotos debe ser un número entero positivo.';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No se encontró el token de usuario. Inicia sesión.');
        setIsLoading(false);
        return;
      }
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const fecha_inicio = `${yyyy}-${mm}-${dd}`;
      const data = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        fecha_inicio,
        fecha_fin: form.fechaFin,
        categorias: form.categorias,
        cantidad_fotos_max: parseInt(form.maxFotosPorUsuario, 10),
      };
      const response = await API.post('/rallies', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rallyId = response.data.rallyId || response.data.id;
      if (rallyId) {
        navigate(`/rallies/${rallyId}`);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        if (
          error.response.data.message.toLowerCase().includes("fecha") &&
          error.response.data.message.toLowerCase().includes("fin")
        ) {
          setErrorMessage("La fecha de fin debe ser posterior a la fecha de inicio (hoy). Por favor, selecciona una fecha válida.");
        } else {
          setErrorMessage(error.response.data.message);
        }
      } else {
        setErrorMessage('Ocurrió un error al crear el rally.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <form
        className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-400">Crear galería</h1>
        {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {fieldErrors.nombre && <p className="text-red-500 text-xs mt-1">{fieldErrors.nombre}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {fieldErrors.descripcion && <p className="text-red-500 text-xs mt-1">{fieldErrors.descripcion}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="fechaFin">Fecha fin:</label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={form.fechaFin}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {fieldErrors.fechaFin && <p className="text-red-500 text-xs mt-1">{fieldErrors.fechaFin}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="categorias">Categorías (separadas por coma):</label>
          <input
            type="text"
            id="categorias"
            name="categorias"
            value={form.categorias}
            onChange={handleChange}
            placeholder="Ej: aventura, cultura, naturaleza"
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {fieldErrors.categorias && <p className="text-red-500 text-xs mt-1">{fieldErrors.categorias}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="maxFotosPorUsuario">Número máximo de fotos por usuario:</label>
          <input
            type="number"
            id="maxFotosPorUsuario"
            name="maxFotosPorUsuario"
            placeholder='Min. 1'
            value={form.maxFotosPorUsuario}
            onChange={handleChange}
            min={1}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {fieldErrors.maxFotosPorUsuario && <p className="text-red-500 text-xs mt-1">{fieldErrors.maxFotosPorUsuario}</p>}
        </div>
        <button
          type="submit"
          className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear galería'}
        </button>
      </form>
    </div>
  );
}

export default CreateRallyForm;