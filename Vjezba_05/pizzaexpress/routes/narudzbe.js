import express from 'express';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  let db = await connectToDatabase();
  let narudzbe_collection = db.collection('narudzbe');
  let pizze_collection = db.collection('pizze');

  let novaNarudzba = req.body;

  let obavezniKljucevi = ['ime', 'adresa', 'telefon', 'narucene_pizze'];

  if (Object.keys(novaNarudzba).length !== obavezniKljucevi.length) {
    return res.status(400).json({ error: 'Pogrešan broj ključeva' });
  }

  if (!obavezniKljucevi.every(kljuc => kljuc in novaNarudzba)) {
    return res.status(400).json({ error: 'Nedostaju obavezni ključevi' });
  }

  let telefon = novaNarudzba.telefon;

  if (typeof telefon === 'number') {
    telefon = telefon.toString();
  }

  if (typeof telefon !== 'string' || !/^\d+$/.test(telefon)) {
    return res.status(400).json({ error: 'Telefon mora biti broj ili string koji sadrži samo brojeve' });
  }

  let obavezniKljuceviStavke = ['naziv', 'kolicina', 'velicina'];

  if (!Array.isArray(novaNarudzba.narucene_pizze) || novaNarudzba.narucene_pizze.length === 0) {
    return res.status(400).json({ error: 'narucene_pizze mora biti polje stavki' });
  }

  if (!novaNarudzba.narucene_pizze.every(stavka =>
    Object.keys(stavka).length === obavezniKljuceviStavke.length &&
    obavezniKljuceviStavke.every(kljuc => kljuc in stavka)
  )) {
    return res.status(400).json({ error: 'Nedostaju obavezni ključevi u stavci narudžbe' });
  }

  if (!novaNarudzba.narucene_pizze.every(stavka => {
    return (
      typeof stavka.naziv === 'string' &&
      Number.isInteger(stavka.kolicina) && stavka.kolicina > 0 &&
      ['mala', 'srednja', 'jumbo'].includes(stavka.velicina)
    );
  })) {
    return res.status(400).json({ error: 'Neispravni podaci u stavci narudžbe' });
  }

  let ukupna_cijena = 0;

  for (let stavka of novaNarudzba.narucene_pizze) {
    let pizza = await pizze_collection.findOne({ naziv: stavka.naziv });

    if (!pizza) {
      return res.status(400).json({ error: `Pizza '${stavka.naziv}' ne postoji` });
    }

    let cijena = pizza.cijene[stavka.velicina];

    if (typeof cijena !== 'number') {
      return res.status(400).json({ error: `Ne postoji cijena za '${stavka.velicina}' za pizzu '${stavka.naziv}'` });
    }

    ukupna_cijena += cijena * stavka.kolicina;
  }

  novaNarudzba.ukupna_cijena = Number(ukupna_cijena.toFixed(2));

  try {
    let result = await narudzbe_collection.insertOne(novaNarudzba);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
   });


export default router;

    
