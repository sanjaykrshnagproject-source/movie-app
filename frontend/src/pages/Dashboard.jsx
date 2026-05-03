import { useState, useEffect } from "react";
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/movies/search?q=${encodeURIComponent(query)}`);
      
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
    // 🚀 vidsrc.pm is currently the most reliable and up-to-date server globally
    return `https://vidsrc.pm/embed/movie/${imdbID}?autoPlay=1`;
  };

  // 🛡️ ULTIMATE SHIELD: Force-block any attempt to redirect the page
  useEffect(() => {
    if (selectedMovie) {
      // Create a history entry to trap redirects
      window.history.pushState(null, null, window.location.href);
      
      const handleBeforeUnload = (e) => {
        // This triggers the "Leave site?" popup which blocks malicious redirects
        const message = "Ad detected! Click 'Stay' or 'Cancel' to continue watching your movie.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      };

      const handlePopState = () => {
        // Prevent back-button redirects used by some ad scripts
        window.history.pushState(null, null, window.location.href);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [selectedMovie]);


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
               </div>
            </div>
            <div className="video-wrapper-full">
              <iframe
                src={getEmbedUrl(selectedMovie.imdbID)}
                title={selectedMovie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
