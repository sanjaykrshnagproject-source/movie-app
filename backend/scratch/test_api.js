const axios = require('axios');

async function test() {
  const url = `https://v3.sg.media-imdb.com/suggestion/i/inception.json`;
  try {
    const res = await axios.get(url);
    console.log('Success:', JSON.stringify(res.data).substring(0, 500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
