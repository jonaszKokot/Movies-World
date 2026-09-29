import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

const CategoryPage = ({ type, endpoint = "popular", title }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${endpoint}?api_key=${API_KEY}&language=pl-PL&page=1`
        );
        const data = await response.json();
        setItems(data.results || []);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, endpoint, API_KEY]);

  return (
    <div className="p-10">
      <h2 className="text-4xl font-black mb-12 text-center uppercase tracking-widest border-b-8 border-black block mx-auto w-fit px-4">
        {title}
      </h2>

      {loading ? (
        <div className="text-center py-20 font-black text-4xl animate-bounce">Wczytywanie...</div>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center">
          {items.map((item) => (
            <MovieCard
              key={item.id}
              id={item.id}
              type={type}
              title={item.title || item.name}
              year={(item.release_date || item.first_air_date || "").split("-")[0]}
              rating={item.vote_average?.toFixed(1)}
              posterUrl={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/500x750?text=Brak+Plakatu"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;