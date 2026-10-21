import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchListContext";

const Navbar = ({ searchTitle, setSearchTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {clearWatchlist} = useWatchlist()
  const [token, setToken] = useState(() => localStorage.getItem("token") || null)
  const [user, setUser] = useState(() => {
    try{
      const storedUser = localStorage.getItem("user")
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null
    }catch{
      return null
    }

  })

  useEffect(() => {
    const currentToken = localStorage.getItem('token') || null
    setToken(currentToken)
    
    try {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname])

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    if (clearWatchlist) {
      clearWatchlist();
    }

    setToken(null)
    setUser(null)

    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.location.reload();
    }
  }

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

      <div>
        {token ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Cześć <strong className="text-yellow-400">{user?.firstName || 'Użytkowniku'}</strong>
            </span>

            <button type="button" onClick={handleLogout} className="px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium rounded">Wyloguj się</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to='/login' className="px-4 py-1.5 border border-zinc-600 hover:border-zinc-400 text-sm font-medium rounded">
              Zaloguj się
            </Link>
            <Link to='/register' className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold rounded">
              Zarejestruj się
            </Link>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
