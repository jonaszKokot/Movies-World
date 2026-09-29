import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const MovieDetails = ({ type }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=pl-PL`
        );
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        console.error("Błąd:", error);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, type, API_KEY]);

  if (loading) return <div className="text-center p-20 font-black text-3xl">Wczytuję detale...</div>;
  if (!data) return <div className="text-center p-20 font-black text-3xl">Nie znaleziono.</div>;

  const title = data.title || data.name;
  const date = (data.release_date || data.first_air_date || "").split("-")[0];

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <Link to="/" className="inline-block mb-8 bg-yellow-400 border-4 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
        ← Wróć
      </Link>

      <div className="flex flex-col md:flex-row gap-12 bg-white border-8 border-black p-8 shadow-[15px_15px_0px_rgba(0,0,0,1)]">
        <div className="shrink-0">
          <img 
            src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} 
            alt={title} 
            className="w-full md:w-80 border-4 border-black shadow-[8px_8px_0px_rgba(139,92,246,1)]"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-black uppercase leading-none">{title}</h1>
          <div className="flex flex-wrap gap-4 font-bold text-xl">
            <span className="bg-pink-500 text-white px-3 py-1 border-2 border-black italic">{date}</span>
            <span className="bg-blue-400 text-white px-3 py-1 border-2 border-black">★ {data.vote_average?.toFixed(1)}</span>
            {data.runtime && <span className="bg-green-400 text-white px-3 py-1 border-2 border-black">{data.runtime} min</span>}
          </div>

          <p className="text-xl leading-relaxed font-medium border-t-2 border-black pt-4">
            {data.overview || "Brak opisu dla tej pozycji."}
          </p>

          <div className="mt-4">
            <h3 className="font-black uppercase text-lg underline">Gatunki:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.genres?.map(genre => (
                <span key={genre.id} className="border-2 border-black px-2 py-1 font-bold text-sm bg-gray-100">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;