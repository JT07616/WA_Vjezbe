import express from 'express';

import moviesRouter from './routes/movies.js';
import actorsRouter from './routes/actors.js';

import requestLogger from './middleware/requestLogger.js';

const app = express();
const PORT = 3000; 


app.use(express.json());
app.use(requestLogger);

app.use('/movies', moviesRouter);
app.use('/actors', actorsRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`movie-server radi na http://localhost:${PORT}`);
  }
});