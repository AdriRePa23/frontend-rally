import React, { useState } from "react";
import API from "../../services/api"; // Asegúrate de importar tu instancia de Axios

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para errores
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para éxito

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

        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessage("Por favor, ingresa un email válido.");
            setIsLoading(false);
            return;
        }

        const data = { email, password };

        try {
            const response = await API.post("/auth/login", data); // Llamada a la API
            const token = response.data.token; // Suponiendo que la API devuelve un token
            localStorage.setItem("token", token); // Guarda el token en localStorage
            setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...");
            setTimeout(() => {
                window.location.href = "/"; // Redirige al usuario a la página principal
            }, 2000);
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Ocurrió un error al iniciar sesión. Inténtalo más tarde.");
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
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
