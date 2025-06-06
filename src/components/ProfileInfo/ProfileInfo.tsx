import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import { Usuario } from '../../types/Usuario';

export interface ProfileInfoProps {}

const ProfileInfo: React.FC<ProfileInfoProps> = React.memo(function ProfileInfo() {
  const { id } = useParams<{ id?: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuario = useCallback(async () => {
    try {
      let userId = id;
      if (!userId) {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró el token de usuario.');
          setLoading(false);
          return;
        }
        const verify = await API.post('/auth/verify-token', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userId = verify.data.user?.id?.toString();
        if (!userId) {
          setError('No se pudo obtener el usuario logueado.');
          setLoading(false);
          return;
        }
      }
      const response = await API.get(`/usuarios/${userId}`);
      setUsuario(response.data);
    } catch {
      setError('No se pudo cargar la información del usuario.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  const anioCreacion = useMemo(() => {
    if ((usuario as any)?.created_at) {
      const fecha = new Date((usuario as any).created_at);
      return fecha.getFullYear().toString();
    }
    return '';
  }, [usuario]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!usuario) return null;

  return (
    <div className="flex items-center bg-gray-900 shadow-md rounded-lg p-8 w-full mx-auto mt-8">
      <img
        src={usuario.foto_perfil}
        alt={`Foto de perfil de ${usuario.nombre}`}
        className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-pink-400 mr-6 sm:mr-8"
      />
      <div className="flex flex-col justify-center w-full">
        <h2 className="text-4xl font-bold text-pink-400 mb-2 break-words">{usuario.nombre}</h2>
        {anioCreacion && (
          <p className="text-lg text-gray-300 mt-2">Usuario desde {anioCreacion}</p>
        )}
      </div>
    </div>
  );
});

ProfileInfo.displayName = "ProfileInfo";

export default ProfileInfo;