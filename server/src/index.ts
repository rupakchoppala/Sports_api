import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;
const API_URL = 'https://www.thesportsdb.com/api/v2/examples/full_league_season_schedule.json';

app.use(cors());

app.get('/api/schedule', async (_req, res) => {
  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error in /api/schedule:', error.message);
    res.status(500).json({ message: 'Failed to fetch schedule data', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
