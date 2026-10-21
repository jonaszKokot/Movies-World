import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setWatchlistIds([]);
      return;
    }

    setIsWatchlistLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlistIds(response.data.map(id => Number(id)));
    } catch (error) {
      console.error('Błąd pobierania watchlisty:', error);
      setWatchlistIds([]);
    } finally {
      setIsWatchlistLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const setFavoriteStatus = (movieId, isFav) => {
    const numId = Number(movieId);
    if (isFav) {
      setWatchlistIds((prev) => [...prev, numId]);
    } else {
      setWatchlistIds((prev) => prev.filter((id) => id !== numId));
    }
  };

  const clearWatchlist = () => {
    setWatchlistIds([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlistIds,
        isWatchlistLoading,
        setFavoriteStatus,
        fetchWatchlist,
        clearWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist musi być użyte wewnątrz WatchlistProvider');
  }
  return context;
};