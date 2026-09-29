import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import MovieRow from "../components/MovieRow";

const Home = ({ searchTitle }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const url = searchTitle.length > 2
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pl-PL&query=${searchTitle}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pl-PL`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTitle]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-black mb-10 text-center uppercase tracking-widest border-b-4 border-black block mx-auto w-fit">
        {searchTitle ? `Wyniki dla: ${searchTitle}` : "Popularne teraz"}
      </h2>

      {loading ? (
        <div className="text-center py-20 font-black text-4xl animate-bounce">Ładowanie...</div>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.release_date?.split("-")[0] || "N/A"}
                rating={movie.vote_average?.toFixed(1) || "0.0"}
                posterUrl={
                  movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=Brak+Plakatu"
                }
              />
            ))
          ) : (
            <p className="text-xl font-bold">Nic nie znaleźliśmy... 🍿</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;