import express from 'express';
import { query, param, body, validationResult } from 'express-validator';

import { actors } from '../data/actorsData.js';
import { findActorById } from '../middleware/actors.js';

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
    query('name')
      .optional()
      .isString().withMessage('name mora biti string')
      .trim()
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;

    if (req.query.name) {
      const searchName = req.query.name.toLowerCase().trim();
      const filtered = actors.filter((a) =>
        a.name.toLowerCase().includes(searchName)
      );
      return res.status(200).json(filtered);
    }

    return res.status(200).json(actors);
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
  findActorById,
  (req, res) => {
    return res.status(200).json(req.actor);
  }
);

router.post(
  '/',
  [
    body('name')
      .notEmpty().withMessage('name je obavezan')
      .isString().withMessage('name mora biti string')
      .trim()
      .escape(),

    body('birthYear')
      .notEmpty().withMessage('birthYear je obavezan')
      .isInt().withMessage('birthYear mora biti integer')
      .toInt()
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;

    const newActor = {
      id: Date.now(),
      name: req.body.name,
      birthYear: req.body.birthYear,
      movies: []
    };

    actors.push(newActor);
    return res.status(201).json(newActor);
  }
);

router.patch(
  '/:id',
  [
    param('id')
      .isInt().withMessage('id mora biti integer')
      .toInt(),

    body().custom((obj) => {
      return obj.name !== undefined || obj.birthYear !== undefined;
    }).withMessage('Pošalji barem jedno od: name, birthYear'),

    body('name')
      .optional()
      .isString().withMessage('name mora biti string')
      .trim()
      .escape(),

    body('birthYear')
      .optional()
      .isInt().withMessage('birthYear mora biti integer')
      .toInt()
  ],
  (req, res, next) => {
    if (handleValidation(req, res)) return;
    next();
  },
  findActorById,
  (req, res) => {
    if (req.body.name !== undefined) req.actor.name = req.body.name;
    if (req.body.birthYear !== undefined) req.actor.birthYear = req.body.birthYear;

    return res.status(200).json(req.actor);
  }
);

export default router;
