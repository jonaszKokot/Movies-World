import MovieRow from "../components/MovieRow";

const Film = ({type}) => {
  return (
    <div className="px-10 pb-10">
      <MovieRow type={type} category={"popular"}/>
      <MovieRow type={type} category={"upcoming"}/>
      <MovieRow type={type} category={"now_playing"}/>
      <MovieRow type={type} category={"top_rated"}/>
    </div>
  );
};

export default Film;