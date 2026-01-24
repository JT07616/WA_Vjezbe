import { movies } from '../data/moviesData.js';

const findMovieById = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const movie = movies.find((m) => m.id === id);

  if (movie) {
    req.movie = movie;
    return next();
  }

  return res.status(404).json({ message: 'Film nije pronađen' });
};

export { findMovieById };