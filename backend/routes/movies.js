const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔍 Search movie using IMDb's public suggestion API
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ msg: "Query required" });

  try {
    const query = q.toLowerCase().replace(/\s+/g, '_');
    const firstLetter = query[0];
    const url = `https://v3.sg.media-imdb.com/suggestion/${firstLetter}/${encodeURIComponent(query)}.json`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.d && data.d.length > 0) {
      // Find the first result that is a movie or TV series (starts with 'tt')
      const movie = data.d.find(item => item.id.startsWith('tt'));

      if (movie) {
        res.json({ 
          imdbID: movie.id,
          title: movie.l,
          year: movie.y,
          poster: movie.i ? movie.i[0] : null
        });
      } else {
        res.status(404).json({ msg: "No movies found" });
      }
    } else {
      res.status(404).json({ msg: "Movie not found" });
    }
  } catch (err) {
    console.error("IMDb API error:", err.message);
    res.status(500).json({ msg: "Error searching movie" });
  }
});

module.exports = router;
