mport React from "react";
import { Link } from "react-router-dom";

interface UserPostCardProps {
  id: number;
  imagen: string;
}

const UserPostCard: React.FC<UserPostCardProps> = ({ id, imagen }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-64 h-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
      <Link to={`/publicaciones/${id}`} className="w-full h-full block">
        <img
          src={imagen}
          alt={`Publicación ${id}`}
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
};

export default UserPostCard;
