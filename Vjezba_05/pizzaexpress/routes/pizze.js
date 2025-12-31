import express from 'express';
import { connectToDatabase } from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  let db = await connectToDatabase();
  let pizze_collection = db.collection('pizze');

  const naziv = req.query.naziv;
  const cijena_min = req.query.cijena_min;
  const cijena_max = req.query.cijena_max;
  const sort = req.query.sort; 

  let filter = {};

  if (naziv) {
    filter.naziv = { $regex: naziv, $options: 'i' };
  }

  if (cijena_min && isNaN(Number(cijena_min))) {
  return res.status(400).json({ error: 'cijena_min mora biti broj' });
  }
  if (cijena_max && isNaN(Number(cijena_max))) {
  return res.status(400).json({ error: 'cijena_max mora biti broj' });
  }

  if (cijena_min || cijena_max) {
    let range = {};
    if (cijena_min) range.$gte = Number(cijena_min);
    if (cijena_max) range.$lte = Number(cijena_max);

    filter.$or = [
      { 'cijene.mala': range },
      { 'cijene.srednja': range },
      { 'cijene.jumbo': range }
    ];
  }

  let sortObj = null;
  if (sort === 'asc') sortObj = { 'cijene.srednja': 1 };
  if (sort === 'desc') sortObj = { 'cijene.srednja': -1 };
  //Sortiranje sam implementirao po srednjoj cijeni jer je to reprezentativna cijena.

  try {
    let cursor = pizze_collection.find(filter);
    if (sortObj) cursor = cursor.sort(sortObj);

    let pizze = await cursor.toArray();
    res.status(200).json(pizze);
  } catch (error) {
    console.log(error?.errorResponse || error);
    res.status(400).json({ error: error?.errorResponse || error });
  }
});


router.get('/:naziv', async (req, res) => {
  let db = await connectToDatabase();
  let pizze_collection = db.collection('pizze');

  let naziv = req.params.naziv;

  let pizza = await pizze_collection.findOne({ naziv: naziv });

  if (!pizza) {
    return res.status(404).json({ message: `Pizza s nazivom '${naziv}' nije pronađena.` });
  }

  res.status(200).json(pizza);
});


router.post('/', async (req, res) => {
  let db = await connectToDatabase();
  let pizze_collection = db.collection('pizze');
  let novaPizza = req.body;

  let obavezniKljucevi = ['naziv', 'sastojci', 'cijene', 'slika_url'];
  let kljucevi = Object.keys(novaPizza);

  if (kljucevi.length !== obavezniKljucevi.length) {
    return res.status(400).json({ error: 'Pogrešan broj ključeva' });
  }

  if (!obavezniKljucevi.every(
    kljuc => kljucevi.includes(kljuc)
  )) {
    return res.status(400).json({ error: 'Nedostaju obavezni ključevi' });
  }

  if (!Array.isArray(novaPizza.sastojci) ||
      !novaPizza.sastojci.every(s => typeof s === 'string')) {
    return res.status(400).json({ error: 'Sastojci moraju biti stringovi' });
  }

  let cijene = novaPizza.cijene;

  if (typeof cijene !== 'object' || cijene === null) {
  return res.status(400).json({ error: 'Cijene moraju biti objekt' });
  }

  if (typeof cijene.mala !== 'number' ||
      typeof cijene.srednja !== 'number' ||
      typeof cijene.jumbo !== 'number') {
    return res.status(400).json({ error: 'Cijene moraju biti brojevi' });
  }

  try {
    let result = await pizze_collection.insertOne(novaPizza);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});


export default router;