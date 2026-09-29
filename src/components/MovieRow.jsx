import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";

const CARD_WIDTH = 304;
const GAP = 32;
const VISIBLE_CARDS = 4;

const MovieRow = ({ type, category }) => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  const titles = {
    popular: "Popularne teraz",
    upcoming: "Nadchodzące premiery",
    now_playing: "W kinach",
    top_rated: "Najlepiej oceniane",
    airing_today: "Dzisiaj w TV",
    on_the_air: "W TV"
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${category}?api_key=${API_KEY}&language=pl-PL`
        );
        const data = await response.json();
        setMovies(data.results || []);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Błąd:", error);
      }
    };

    fetchMovies();
  }, [category]);

  const nextSlide = () => {
    setCurrentIndex((index) =>
      index < movies.length - VISIBLE_CARDS ? index + 1 : index
    );
  };

  const previousSlide = () => {
    setCurrentIndex((index) => (index > 0 ? index - 1 : 0));
  };

  return (
    <div className="my-10">
      <h2 className="mx-auto mb-10 w-fit rounded-md bg-black px-5 py-2 text-3xl font-black uppercase italic text-white">
        {titles[category]}
      </h2>

      <div className="relative mx-auto w-fit">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-[#FDF5E6] to-transparent"/>
        <div className=" pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-[#FDF5E6] to-transparent"/>

        <button onClick={previousSlide} disabled={currentIndex === 0} className=" absolute -left-20 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black disabled:cursor-not-allowed disabled:opacity-30">
          <FaChevronLeft size={20} />
        </button>

        <div className="overflow-hidden"style={{width: `${VISIBLE_CARDS * CARD_WIDTH + (VISIBLE_CARDS - 1) * GAP}px`}}>
          <div className="flex gap-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform" style={{transform: `translateX(-${currentIndex * (CARD_WIDTH + GAP)}px)`}}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="min-w-72 max-w-72"
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title || movie.name}
                  year={
                    (
                      movie.release_date ||
                      movie.first_air_date
                    )?.split("-")[0]
                  }
                  rating={movie.vote_average?.toFixed(1)}
                  posterUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  type={type}
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={nextSlide} disabled={currentIndex >= movies.length - VISIBLE_CARDS} className="absolute -right-20 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black disabled:cursor-not-allowed disabled:opacity-30">
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;