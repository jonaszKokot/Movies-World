import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import CategoryPage from "./pages/CategoryPage";
import Film from "./pages/Film";
import Serial from "./pages/Serial";
import SearchPage from "./pages/SearchPage";

function App() {
  const [searchTitle, setSearchTitle] = useState("");

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans">
      <Navbar searchTitle={searchTitle} setSearchTitle={setSearchTitle} />
      
      <Routes>
        <Route path="/" element={<Home searchTitle={searchTitle} />} />
        <Route path="/movies" element={<Film type="movie"/>} />
        <Route path="/tv" element={<Serial type="tv" title="Seriale TV" />} />
        <Route path="/ranking" element={<CategoryPage type="movie" endpoint="top_rated" title="Ranking Top 100" />} />
        <Route path="/movie/:id" element={<MovieDetails type="movie" />} />
        <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
        <Route path="/search" element={<SearchPage searchTitle={searchTitle}/>}/>
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;