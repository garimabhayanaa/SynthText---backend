const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const runInference = require('./inference.js'); 

// CORS setup for Vercel frontend
const allowedOrigins = ['https://synthtext-garima-bhayanas-projects.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.static('public'));

app.post('/inference', async (req, res) => {
  console.log('/inference route hit');
  const { text, task, tone } = req.body;
  if (!text || !task || !tone) {
    return res.status(400).send("Missing 'text', 'task', or 'tone'");
  }
  try {
    console.log('starting running inference.js')
    const output = await runInference(text, task, tone);
    res.send(output);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
