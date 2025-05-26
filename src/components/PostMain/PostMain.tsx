import React from "react";

interface PostMainProps {
  fotografia: string;
  creador: {
    nombre: string;
    foto_perfil: string;
  };
  descripcion?: string;
  votos: number;
}

const PostMain: React.FC<PostMainProps> = ({ fotografia, creador, descripcion, votos }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full flex justify-center bg-neutral-900 rounded-t-xl">
        <img
          src={fotografia}
          alt="Publicación"
          className="w-full max-h-[600px] object-contain rounded-t-xl bg-neutral-900"
        />
      </div>
      <div className="w-full px-8 py-6 bg-neutral-50 border-t border-neutral-200 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <img
              src={creador.foto_perfil}
              alt={creador.nombre}
              className="w-12 h-12 rounded-full border border-neutral-300 shadow-lg"
            />
            <span className="font-semibold text-lg text-neutral-900">{creador.nombre}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 text-pink-500">
              <path d="M12.62 20.84a1.5 1.5 0 0 1-1.24 0C7.1 18.7 2 14.92 2 10.36A5.37 5.37 0 0 1 7.36 5a5.13 5.13 0 0 1 4.64 2.88A5.13 5.13 0 0 1 16.64 5 5.37 5.37 0 0 1 22 10.36c0 4.56-5.1 8.34-9.38 10.48Z" />
            </svg>
            <span className="text-lg font-bold text-pink-600">{votos}</span>
          </div>
        </div>
        {descripcion && (
          <div className="text-neutral-800 text-base break-words">
            {descripcion}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostMain;
