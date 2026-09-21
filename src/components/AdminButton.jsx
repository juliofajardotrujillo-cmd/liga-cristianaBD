import { Link } from "react-router-dom";

export default function AdminButton() {
  return (
    <Link
      to="/admin"
      aria-label="Panel de administrador"
      title="Panel de administrador"
      className="relative w-10 h-10 rounded-full glass-pill flex items-center justify-center text-forest-850 active:scale-95 transition-transform hover:text-emerald-700"
    >
      <svg
        className="w-5 h-5 stroke-current"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.85"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c0-3.59 3.36-6.5 7.5-6.5s7.5 2.91 7.5 6.5" />
      </svg>
    </Link>
  );
}
