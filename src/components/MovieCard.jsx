import { Link } from "react-router-dom";

const MovieCard = ({ id, title, year, rating, posterUrl, type = "movie" }) => {
  return (
    <Link to={`/${type}/${id}`}>
      <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all cursor-pointer w-64 h-full flex flex-col group">
        <div className="overflow-hidden border-2 border-black mb-4">
          <img 
            src={posterUrl} 
            alt={title} 
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform" 
          />
        </div>
        <h3 className="font-black text-xl uppercase truncate mb-auto leading-tight">{title}</h3>
        
        <div className="flex justify-between items-center font-bold mt-4">
            <span className="bg-yellow-400 border-2 border-black px-2 py-1 text-sm">{year}</span>
            <span className="text-pink-600">★ {rating}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;