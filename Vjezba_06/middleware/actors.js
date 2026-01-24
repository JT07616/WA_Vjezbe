import { actors } from '../data/actorsData.js';

const findActorById = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const actor = actors.find((a) => a.id === id);

  if (actor) {
    req.actor = actor;
    return next();
  }

  return res.status(404).json({ message: 'Glumac nije pronađen' });
};

export { findActorById };