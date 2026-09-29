import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = ({ searchTitle, setSearchTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    setSearchTitle(e.target.value);
    e.target.value.length > 0 ? navigate("/search") : navigate("/");
  }

  useEffect(() => {
    if (location.pathname !== "/search"){
      setSearchTitle("");
    }
  }, [location.pathname, setSearchTitle]);

  return (
    <nav className="bg-white border-b-8 border-black p-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
      <Link to="/" className="text-4xl font-black uppercase tracking-tighter">
        MOVIES<span className="bg-yellow-400 px-2">WORLD</span>
      </Link>

      <div className="flex gap-6 font-black uppercase">
        <Link to="/movies" className="hover:underline">Filmy</Link>
        <Link to="/tv" className="hover:underline">Seriale</Link>
        <Link to="/ranking" className="hover:underline text-pink-600">Ranking</Link>
      </div>

      <input
        type="text"
        placeholder="Szukaj filmu..."
        className="border-4 border-black p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all w-full md:w-64"
        value={searchTitle}
        onChange={handleSearch}
      />
    </nav>
  );
};

export default Navbar;