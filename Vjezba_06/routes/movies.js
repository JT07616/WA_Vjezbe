import express from 'express';
import { param, body, query, validationResult } from 'express-validator';

import { movies } from '../data/moviesData.js';
import { findMovieById } from '../middleware/movies.js';

const router = express.Router();

const handleValidation = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }

  return false;
};

router.get(
  '/',
  [
    query('min_year')
      .optional()
      .isInt().withMessage('min_year mora biti integer')
      .toInt(),

    query('max_year')
      .optional()
      .isInt().withMessage('max_year mora biti integer')
      .toInt()
      .custom((value, { req }) => {
        if (req.query.min_year !== undefined) {
          return req.query.min_year < value;
        }
        return true;
      })
      .withMessage('Mora vrijediti min_year < max_year')
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;

    let result = movies;

    if (req.query.min_year !== undefined) {
      result = result.filter((m) => m.year >= req.query.min_year);
    }

    if (req.query.max_year !== undefined) {
      result = result.filter((m) => m.year <= req.query.max_year);
    }

    return res.status(200).json(result);
  }
);


router.get(
  '/:id',
  [
    param('id')
      .isInt().withMessage('id mora biti integer')
      .toInt()
  ],
  (req, res, next) => {
    if (handleValidation(req, res)) return;
    next();
  },
  findMovieById,
  (req, res) => {
    return res.status(200).json(req.movie);
  }
);

router.post(
  '/',
  [
    body('title')
      .notEmpty().withMessage('title je obavezan')
      .isString().withMessage('title mora biti string')
      .trim()
      .escape(),

    body('year')
      .notEmpty().withMessage('year je obavezan')
      .isInt().withMessage('year mora biti integer')
      .toInt(),

    body('genre')
      .notEmpty().withMessage('genre je obavezan')
      .isString().withMessage('genre mora biti string')
      .trim()
      .escape(),

    body('director')
      .notEmpty().withMessage('director je obavezan')
      .isString().withMessage('director mora biti string')
      .trim()
      .escape()
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;

    const newMovie = {
      id: Date.now(),
      title: req.body.title,
      year: req.body.year,
      genre: req.body.genre,
      director: req.body.director
    };

    movies.push(newMovie);
    return res.status(201).json(newMovie);
  }
);



router.patch(
  '/:id',
  [
    param('id')
      .isInt().withMessage('id mora biti integer')
      .toInt(),

    body().custom((obj) => {
      return (
        obj.title !== undefined ||
        obj.year !== undefined ||
        obj.genre !== undefined ||
        obj.director !== undefined
      );
    }).withMessage('Pošalji barem jedno od: title, year, genre, director'),

    body('title')
      .optional()
      .isString().withMessage('title mora biti string')
      .trim()
      .escape(),

    body('year')
      .optional()
      .isInt().withMessage('year mora biti integer')
      .toInt(),

    body('genre')
      .optional()
      .isString().withMessage('genre mora biti string')
      .trim()
      .escape(),

    body('director')
      .optional()
      .isString().withMessage('director mora biti string')
      .trim()
      .escape()
  ],
  (req, res, next) => {
    if (handleValidation(req, res)) return;
    next();
  },
  findMovieById,
  (req, res) => {
    if (req.body.title !== undefined) req.movie.title = req.body.title;
    if (req.body.year !== undefined) req.movie.year = req.body.year;
    if (req.body.genre !== undefined) req.movie.genre = req.body.genre;
    if (req.body.director !== undefined) req.movie.director = req.body.director;

    return res.status(200).json(req.movie);
  }
);

export default router;