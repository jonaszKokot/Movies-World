import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react"
import { useWatchlist } from "../context/WatchListContext";

const MovieCard = ({
  id,
  title,
  year,
  rating,
  posterUrl,
  type = "movie",
}) => {
  const { watchlistIds, isWatchlistLoading, setFavoriteStatus } = useWatchlist();
  const isFavorite = watchlistIds.includes(Number(id));
  const [loading, setLoading] = useState(false);

  const handleToggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Musisz być zalogowany, aby zarządzać listą!");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/watchlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteStatus(id, false);
      } else {
        await axios.post(
          "http://localhost:5000/api/watchlist",
          { movieId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavoriteStatus(id, true);
      }
    } catch (error) {
      alert(
        error.response?.data?.error || "Wystąpił problem z aktualizacją listy."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/${type}/${id}`}>
      <div className="group flex h-full w-64 cursor-pointer flex-col border-4 border-black bg-white p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 overflow-hidden border-2 border-black">
          <img
            src={posterUrl}
            alt={title}
            className="h-72 w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="flex items-center justify-between gap-1">
          <h3 className="mb-auto min-w-0 truncate font-black text-xl uppercase leading-tight">
            {title}
          </h3>
          <button
            onClick={handleToggleWatchlist}
            disabled={loading || isWatchlistLoading}
            className="p-1 hover:scale-110 transition-transform focus:outline-none"
            title={isFavorite ? "Usuń z listy" : "Dodaj do listy"}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-500"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between font-bold">
          <span className="border-2 border-black bg-yellow-400 px-2 py-1 text-sm">
            {year}
          </span>
          <span className="text-pink-600">★ {rating}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
