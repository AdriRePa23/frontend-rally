import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import { Usuario } from '../../types/Usuario';
import UserPostCard from '../UserPostCard/UserPostCard';

function ProfileInfo() {
  const { id } = useParams<{ id?: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [posts, setPosts] = useState<Array<{ id: number; imagen: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        let userId = id;
        if (!userId) {
          // Si no hay id en la URL, obtener el usuario logueado
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No se encontró el token de usuario.');
            setLoading(false);
            return;
          }
          const verify = await API.post('/auth/verify-token', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          userId = verify.data.user?.id;
          if (!userId) {
            setError('No se pudo obtener el usuario logueado.');
            setLoading(false);
            return;
          }
        }
        const response = await API.get(`/usuarios/${userId}`);
        setUsuario(response.data);
        // Obtener publicaciones del usuario (ruta correcta)
        const postsRes = await API.get(`/publicaciones/usuario/${userId}`);
        setPosts(postsRes.data);
      } catch (err: any) {
        setError('No se pudo cargar la información del usuario.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!usuario) return null;

  // Formatear año de creación
  let anioCreacion = '';
  if ((usuario as any).created_at) {
    const fecha = new Date((usuario as any).created_at);
    anioCreacion = fecha.getFullYear().toString();
  }

  return (
    <>
      <div className="flex items-center bg-white shadow-md rounded-lg p-8 w-full max-w-5xl mx-auto mt-8">
        <img
          src={usuario.foto_perfil}
          alt={`Foto de perfil de ${usuario.nombre}`}
          className="w-48 h-48 rounded-full object-cover border-4 border-blue-300 mr-8"
        />
        <div className="flex flex-col justify-center w-full">
          <h2 className="text-4xl font-bold text-blue-900 mb-2 break-words">{usuario.nombre}</h2>
          {anioCreacion && (
            <p className="text-lg text-gray-600 mt-2">Usuario desde {anioCreacion}</p>
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto w-full mt-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-900">Publicaciones</h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">Este usuario no tiene publicaciones.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <UserPostCard key={post.id} id={post.id} imagen={post.imagen} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileInfo;