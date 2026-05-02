const axios = require('axios');

async function test() {
  const q = 'Inception';
  const url = `https://www.imdb.com/find?q=${encodeURIComponent(q)}&s=tt`;
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    // Look for ttID in the HTML
    const match = res.data.match(/title\/(tt\d+)/);
    console.log('Match found:', match ? match[1] : 'None');
    
    // If not found, log a bit of HTML to see what's wrong
    if (!match) {
      console.log('Snippet:', res.data.substring(0, 1000));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
