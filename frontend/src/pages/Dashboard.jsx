import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSelectedMovie(null);
    try {
      const res = await axios.get(`http://localhost:5001/api/movies/search?q=${encodeURIComponent(query)}`);
      
      if (res.data.imdbID) {
        setSelectedMovie(res.data);
      } else {
        alert("Movie not found! Try another name.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert(error.response?.data?.msg || "Movie not found! Try another name.");
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (imdbID) => {
    // 🚀 Most reliable standard movie server
    return `https://vidsrc.to/embed/movie/${imdbID}`;
  };

  const handleDownload = () => {
    if (!selectedMovie) return;
    const downloadUrl = `https://vidsrc.me/download/${selectedMovie.imdbID}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className={`dashboard-v2 ${selectedMovie ? "playing-mode" : ""}`}>
      <div className="bg-overlay"></div>
      
      {!selectedMovie && (
        <nav className="navbar-v2">
          <h2 className="logo" onClick={() => window.location.reload()}>MyMovies</h2>
          <div className="nav-right">
            <span className="user-name">Welcome, {user?.username}</span>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>
      )}

      <div className={selectedMovie ? "full-screen-player" : "hero-content"}>
        {!selectedMovie ? (
          <div className="search-center">
            <h1 className="hero-title">Unlimited movies, TV shows, and more</h1>
            <p className="hero-subtitle">Search for any movie to start watching instantly.</p>
            <form onSubmit={handleSearch} className="netflix-search">
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={loading}>
                {loading ? "..." : "Get Started >"}
              </button>
            </form>
          </div>
        ) : (
          <div className="player-v2 animate-fade-in">
            <div className="player-controls-overlay">
               <button className="back-btn-circle" onClick={() => setSelectedMovie(null)} title="Back to Search">✕</button>
               <div className="player-info-mini">
                  <h2>{selectedMovie.title}</h2>
                  <button className="dl-mini" onClick={handleDownload}>⬇ Download</button>
               </div>
            </div>
            <div className="video-wrapper-full">
              <iframe
                src={getEmbedUrl(selectedMovie.imdbID)}
                title={selectedMovie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
