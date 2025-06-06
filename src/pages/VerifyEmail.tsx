import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import API from "../services/api";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState<string>("Verificando tu cuenta...");
  const [email, setEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token no proporcionado.");
        return;
      }
      try {
        const res = await API.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage("¡Cuenta verificada correctamente! Ya puedes iniciar sesión.");
        setEmail(res.data?.email || null);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "No se pudo verificar la cuenta. El enlace puede haber expirado o ya fue usado."
        );
        setEmail(err?.response?.data?.email || null);
      }
    };
    verify();
  }, [token]);

  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate]);

  const handleResend = useCallback(async () => {
    if (!email) return;
    setResendStatus("loading");
    setResendMessage(null);
    try {
      await API.post("/auth/resend-verification", { email });
      setResendStatus("sent");
      setResendMessage("Correo de verificación reenviado. Revisa tu bandeja de entrada.");
    } catch {
      setResendStatus("error");
      setResendMessage("No se pudo reenviar el correo de verificación.");
    }
  }, [email]);

  return (
    <div className="flex h-screen bg-gray-950">
      <AsideNavBar />
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-950 relative md:ml-64 pt-20 md:pt-0">
        <div className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-6 text-pink-400">Verificación de cuenta</h1>
          <p
            className={
              status === "success"
                ? "text-green-400 font-semibold"
                : status === "error"
                ? "text-red-400 font-semibold"
                : "text-gray-200"
            }
          >
            {message}
          </p>
          {status === "error" && email && (
            <div className="mt-6">
              <button
                onClick={handleResend}
                disabled={resendStatus === "loading"}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
              >
                {resendStatus === "loading" ? "Enviando..." : "Reenviar correo de verificación"}
              </button>
              {resendMessage && (
                <div className={`mt-2 text-sm ${resendStatus === "sent" ? "text-green-400" : "text-red-400"}`}>
                  {resendMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
