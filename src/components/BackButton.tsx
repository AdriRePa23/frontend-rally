import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = "", label = "Volver atrás" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 shadow-sm text-gray-700 font-medium transition ${className}`}
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      {label}
    </button>
  );
};

export default BackButton;
