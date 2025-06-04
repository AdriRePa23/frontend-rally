import React, { useState } from "react";
import API from "../../services/api";

// Tipado explícito y exportable para reutilización
export interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = React.memo(function RegisterForm() {
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

        if (
            password.length < 6 ||
            password.length > 255 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            setErrorMessage("La contraseña debe tener entre 6 y 255 caracteres, incluir mayúsculas, minúsculas y números.");
            setIsLoading(false);
            return;
        }

        const data = { nombre, email, password };

        try {
            const response = await API.post("/auth/register", data);
            setSuccessMessage(response.data.message); 
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 2000);
        } catch (error: any) {
            // Manejo de mensajes de error específicos de la API
            const apiMsg = error.response?.data?.message;
            if (apiMsg === "El usuario ya está registrado" || apiMsg === "El email ya está registrado") {
                setErrorMessage("El email ya está registrado.");
            } else if (apiMsg === "Todos los campos son obligatorios") {
                setErrorMessage("Por favor, completa todos los campos.");
            } else if (apiMsg === "Error al registrar el usuario") {
                setErrorMessage("Ocurrió un error al registrarse. Inténtalo más tarde.");
            } else {
                setErrorMessage(apiMsg || "Ocurrió un error al registrarse. Inténtalo más tarde.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
            <form
                className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
                onSubmit={handleSubmit}
            >
                <h1 className="text-4xl font-bold mb-6 text-center text-pink-400">Registrarse</h1>
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
                    className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Cargando..." : "Registrarse"}
                </button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">
                        ¿Ya tienes una cuenta?{" "}
                        <a
                            href="/auth/login"
                            className="text-pink-400 hover:text-pink-200 font-bold"
                        >
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
});

RegisterForm.displayName = "RegisterForm";

export default RegisterForm;
