import React from "react";
import { Link } from "react-router-dom";

interface UserPostCardProps {
  id: number;
  imagen: string;
}

const UserPostCard: React.FC<UserPostCardProps> = React.memo(({ id, imagen }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex items-center justify-center hover:scale-105 transition-transform duration-200 p-2">
      <Link to={`/publicaciones/${id}`} className="block w-full h-full">
        <img
          src={imagen}
          alt={`Publicación ${id}`}
          className="max-w-[260px] max-h-[320px] w-auto h-auto object-contain mx-auto my-0 rounded"
          loading="lazy"
        />
      </Link>
    </div>
  );
});

export default UserPostCard;
