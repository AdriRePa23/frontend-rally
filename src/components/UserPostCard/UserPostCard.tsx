import React from "react";
import { Link } from "react-router-dom";

interface UserPostCardProps {
  id: number;
  imagen: string;
  rally_id: number;
}

const UserPostCard: React.FC<UserPostCardProps> = React.memo(({ id, imagen, rally_id }) => {
  return (
    <Link
      to={`/rallies/${rally_id}/publicacion/${id}`}
      className="group block w-full max-w-xs"
      style={{ aspectRatio: "1/1" }}
    >
      <div className="relative w-full h-0 pb-[100%] rounded-xl overflow-hidden shadow-lg bg-gray-200 group-hover:shadow-xl transition-shadow duration-200">
        <img
          src={imagen}
          alt={`Publicación ${id}`}
          className="absolute inset-0 w-full h-full object-contain bg-white"
          loading="lazy"
        />
        <div className="absolute inset-0 rounded-xl border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
      </div>
    </Link>
  );
});

export default UserPostCard;
