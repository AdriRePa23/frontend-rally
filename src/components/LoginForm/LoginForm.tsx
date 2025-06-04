import React, { useState } from "react";
import API from "../../services/api";

// Tipado explícito y exportable para reutilización
export interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = React.memo(function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Validación de los campos
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email) || email.length > 255) {
      setErrorMessage("Por favor, ingresa un email válido y que no exceda los 255 caracteres.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6 || password.length > 255) {
      setErrorMessage("La contraseña debe tener entre 6 y 255 caracteres.");
      setIsLoading(false);
      return;
    }

    const data = { email, password };

    try {
      const response = await API.post("/auth/login", data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch (error: any) {
      // Manejo de mensajes de error específicos de la API
      const apiMsg = error.response?.data?.message;
      if (apiMsg === "Usuario no encontrado" || apiMsg === "Credenciales incorrectas") {
        setErrorMessage("Credenciales incorrectas.");
      } else if (apiMsg === "Por favor, verifica tu cuenta antes de iniciar sesión") {
        setErrorMessage("Por favor, verifica tu cuenta antes de iniciar sesión.");
      } else if (apiMsg === "Token no válido" || apiMsg === "Token inválido") {
        setErrorMessage("Token no válido.");
      } else if (apiMsg === "Error al iniciar sesión") {
        setErrorMessage("Ocurrió un error al iniciar sesión. Inténtalo más tarde.");
      } else {
        setErrorMessage(apiMsg || "Ocurrió un error al iniciar sesión. Inténtalo más tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Email:
          </label>
          <input
            type="text"
            id="username"
            placeholder="Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="username"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading} // Desactiva el botón mientras se está cargando
        >
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <a
              href="/auth/register"
              className="text-blue-500 hover:text-blue-800 font-bold"
            >
              Regístrate aquí
            </a>
          </p>
          <p className="text-sm mt-2">
            <a
              href="/auth/recover-password"
              className="text-blue-500 hover:text-blue-800 font-bold"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>
        </div>
      </form>
    </div>
  );
});

LoginForm.displayName = "LoginForm";

export default LoginForm;
