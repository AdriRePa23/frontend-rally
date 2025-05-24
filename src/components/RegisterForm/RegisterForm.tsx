import React, { useState } from "react";
import API from "../../services/api";

function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para el mensaje de éxito

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const nombre = formData.get("nombre") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Validación de los campos
        if (!nombre || !email || !password) {
            setErrorMessage("Por favor, completa todos los campos.");
            setIsLoading(false);
            return;
        }

        if (nombre.length > 255) {
            setErrorMessage("El nombre no puede tener más de 255 caracteres.");
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

        const data = { nombre, email, password };

        try {
            const response = await API.post("/auth/register", data);
            setSuccessMessage(response.data.message); 
            setTimeout(() => {
                window.location.href = "/auth/login"; // Redirige al usuario a la página de inicio de sesión
            }, 2000);
        } catch (error: any) {
            console.error("Error al registrarse:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Ocurrió un error al registrarse. Inténtalo más tarde.");
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
                <h1 className="text-4xl font-bold mb-6 text-center">Registrarse</h1>
                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
                )}
                {successMessage && (
                    <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>
                )}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="nombre"
                    >
                        Nombre:
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Nombre"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="nombre"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="email"
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
                    {isLoading ? "Cargando..." : "Registrarse"}
                </button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <a
                            href="/auth/login"
                            className="text-blue-500 hover:text-blue-800 font-bold"
                        >
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
