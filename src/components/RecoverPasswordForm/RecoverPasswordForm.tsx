import React, { useState, useCallback } from "react";
import API from "../../services/api";

export interface RecoverPasswordFormProps {}

const RecoverPasswordForm: React.FC<RecoverPasswordFormProps> = React.memo(
  function RecoverPasswordForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setIsLoading(true);
        try {
          await API.post("/auth/request-password-reset", { email });
          setSuccessMessage(
            "Si el email existe, se ha enviado un correo de recuperación."
          );
        } catch {
          setErrorMessage("No se pudo enviar el correo de recuperación.");
        } finally {
          setIsLoading(false);
        }
      },
      [email]
    );

    return (
      <form
        className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-400">
          Recuperar contraseña
        </h1>
        {successMessage && (
          <p className="text-green-500 text-sm mb-4 text-center">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </p>
        )}
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Introduce tu email"
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar correo de recuperación"}
        </button>
      </form>
    );
  }
);

RecoverPasswordForm.displayName = "RecoverPasswordForm";

export default RecoverPasswordForm;
