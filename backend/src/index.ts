import express from 'express';

const app = express();
const port = 3001; //vite側を3000にするため

// CORS（Cross-Origin Resource Sharing）の設定
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
