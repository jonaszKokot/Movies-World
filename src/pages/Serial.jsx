import MovieRow from "../components/MovieRow";

const Serial = ({type}) => {
  return (
    <div className="px-10 pb-10">
      <MovieRow type={type} category={"popular"}/>
      <MovieRow type={type} category={"airing_today"}/>
      <MovieRow type={type} category={"on_the_air"}/>
      <MovieRow type={type} category={"top_rated"}/>
    </div>
  );
};

export default Serial;