import React, { useState, useCallback } from "react";
import API from "../../services/api";
import { useSearchParams } from "react-router-dom";

export interface ResetPasswordFormProps {}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = React.memo(function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
      } catch (err: any) {
        const apiMsg = err.response?.data?.message;
        if (apiMsg === "Token inválido o expirado" || apiMsg === "Token expirado" || apiMsg === "Token expirado o invalido") {
          setErrorMessage("El enlace de recuperación ha expirado o es inválido.");
        } else if (apiMsg === "Token y nueva contraseña son obligatorios") {
          setErrorMessage("Token y nueva contraseña son obligatorios.");
        } else if (apiMsg === "Error al restablecer la contraseña") {
          setErrorMessage("No se pudo restablecer la contraseña. Intenta de nuevo.");
        } else {
          setErrorMessage(apiMsg || "No se pudo restablecer la contraseña. El enlace puede haber expirado.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [token, newPassword, repeatPassword]
  );

  return (
    <form
      className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-6 text-center text-pink-400">
        Restablecer contraseña
      </h1>
      {successMessage && (
        <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
      )}
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="newPassword">
          Nueva contraseña:
        </label>
        <input
          type="password"
          id="newPassword"
          placeholder="Nueva contraseña"
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div className="mb-6">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="repeatPassword">
          Repite la contraseña:
        </label>
        <input
          type="password"
          id="repeatPassword"
          placeholder="Repite la contraseña"
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <button
        type="submit"
        className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
});

ResetPasswordForm.displayName = "ResetPasswordForm";

export default ResetPasswordForm;
