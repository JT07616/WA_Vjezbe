import express from 'express';
const router = express.Router();

const pizze = [
  { id: 1, naziv: 'Margherita', cijena: 6.5 },
  { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
  { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
  { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
  { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
];

let narudzbe = [];

router.post('/', (req, res) => {
 const narudzba = req.body;

  if (!narudzba.narudzba || !Array.isArray(narudzba.narudzba) || narudzba.narudzba.length === 0) {
    return res.status(400).json({ message: 'Narudžba mora sadržavati barem jednu pizzu.' });
  }

  if (!narudzba.klijent || !narudzba.klijent.prezime || !narudzba.klijent.adresa || !narudzba.klijent.broj_telefona) {
    return res.status(400).json({ message: 'Nedostaju podaci o klijentu.' });
  }

  const stavke = narudzba.narudzba;
  if (stavke.some(s => !s.pizza || !s.velicina || !s.kolicina)) {
    return res.status(400).json({ message: 'Pojedine vrijednosti nedostaju!' });
  }

  if (stavke.some(s => !pizze.some(p => p.naziv === s.pizza))) {
    return res.status(400).json({ message: 'Jedna ili više pizza ne postoji u meniju.' });
  }

  const ukupna_cijena = stavke.reduce(
    (sum, s) => sum + pizze.find(p => p.naziv === s.pizza).cijena * s.kolicina,
    0
  );

  const imena = stavke.map(s => `${s.pizza} (${s.velicina})`).join(' i ');

 
  const id = narudzbe.length === 0 ? 1 : Math.max(...narudzbe.map(n => n.id)) + 1;

  const novaNarudzba = {
    id,
    klijent: narudzba.klijent,
    stavke,
    ukupna_cijena
  };

  narudzbe.push(novaNarudzba);

  res.status(200).json({
    message: `Vaša narudžba za ${imena} je uspješno zaprimljena!`,
    prezime: narudzba.klijent.prezime,
    adresa: narudzba.klijent.adresa,
    ukupna_cijena
  });
});


router.get('/', (req, res) => {
  res.status(200).json(narudzbe);
});


router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID mora biti broj.' });
  }

  const narudzba = narudzbe.find(n => n.id === id);
  if (narudzba) {
    res.status(200).json(narudzba);
  } else {
    res.status(404).json({ message: 'Narudžba s traženim ID-em ne postoji.' });
  }
});


router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID mora biti broj.' });
  }

  const index = narudzbe.findIndex(n => n.id === id);
  if (index !== -1) {
    narudzbe.splice(index, 1);
    res.status(200).json({ message: 'Narudžba uspješno obrisana.' });
  } else {
    res.status(404).json({ message: 'Narudžba s traženim ID-em ne postoji.' });
  }
});

export default router;