import { Star } from "lucide-react";
import axios from 'axios';

export default function FavoriteStar({ movieId, favoriteIds, setFavoriteIds }) {
  const token = localStorage.getItem('token');
  
  const isFavorite = favoriteIds.includes(movieId);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert('Musisz być zalogowany, aby dodać film do ulubionych!');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/favorites/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFavoriteIds((prev) => prev.filter((id) => id !== movieId));
      } else {
        await axios.post(
          'http://localhost:5000/api/favorites',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFavoriteIds((prev) => [...prev, movieId]);
      }
    } catch (error) {
      console.error('Błąd aktualizacji ulubionych:', error);
      alert('Nie udało się zaktualizować ulubionych.');
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      className="shrink-0 p-1 transition-transform hover:scale-125 disabled:opacity-50"
    >
      <Star
        className={`h-6 w-6 text-[#f59e0b] transition-colors ${
          isFavorite ? "fill-[#f59e0b]" : "fill-none"
        }`}
      />
    </button>
  );
}