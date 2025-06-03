import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useSearchParams } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      if (!token) return;
      try {
        const res = await API.get(`/auth/reset-password/info?token=${token}`);
        setEmail(res.data.email);
      } catch {
        setErrorMessage("Token inválido o expirado.");
      }
    };
    fetchEmail();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token) {
      setErrorMessage("Token no válido.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    setIsLoading(true);
    try {
      await API.post(`/auth/reset-password?token=${token}`, {
        nuevaContrasena: newPassword,
      });
      setSuccessMessage("Contraseña restablecida correctamente. Ya puedes iniciar sesión.");
    } catch {
      setErrorMessage("No se pudo restablecer la contraseña. El enlace puede haber expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h1>
      {email && (
        <p className="text-gray-700 text-center mb-2">
          Cambiando contraseña para: <span className="font-semibold">{email}</span>
        </p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
          Nueva contraseña:
        </label>
        <input
          type="password"
          id="newPassword"
          placeholder="Nueva contraseña"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
          Repite la contraseña:
        </label>
        <input
          type="password"
          id="repeatPassword"
          placeholder="Repite la contraseña"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
