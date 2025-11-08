import express from 'express';
const router = express.Router();

const pizze = [
  { id: 1, naziv: 'Margerita', cijena: 7.0 },
  { id: 2, naziv: 'Capricciosa', cijena: 9.0 },
  { id: 3, naziv: 'Šunka sir', cijena: 8.0 },
  { id: 4, naziv: 'Vegetariana', cijena: 12.0 },
  { id: 5, naziv: 'Quattro formaggi', cijena: 15.0 }
];


router.get('/', (req, res) => {
  res.status(200).json(pizze);
});


router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) return res.status(400).json({ message: 'ID pizze mora biti broj.' });

  const pizza = pizze.find(p => p.id == id); 

  if (pizza) {
    res.status(200).json(pizza);
  } else {
    res.status(404).json({ message: 'Pizza s traženim ID-em ne postoji.' });
  }
});

router.put('/:id', (req, res) => {

  const id = Number(req.params.id);

  if (isNaN(id)) return res.status(400).json({ message: 'ID pizze mora biti broj.' });

  const novaPizza = req.body;

  const index = pizze.findIndex(p => p.id == id);

  if (index !== -1) {
    if (!novaPizza.naziv || !novaPizza.cijena) {
      return res.status(400).json({ message: 'Nedostaju naziv ili cijena.' });
    }

    novaPizza.id = pizze[index].id; 
    pizze[index] = novaPizza;
    res.status(200).json(pizze[index]);
  } else {
    res.status(404).json({ message: 'Pizza s traženim ID-em ne postoji.' });
  }
});


router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'ID pizze mora biti broj.' });

  const index = pizze.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Pizza s traženim ID-em ne postoji.' });

  const izmjene = req.body;
  Object.keys(izmjene).forEach(key => pizze[index][key] = izmjene[key]);

  res.status(200).json(pizze[index]);
});


router.delete('/:id', (req, res) => {
  const id = req.params.id;

  
  if (isNaN(id)) return res.status(400).json({ message: 'ID pizze mora biti broj.' });

  const index = pizze.findIndex(p => p.id == id); 
  if (index !== -1) {
    pizze.splice(index, 1);
    res.status(200).json({ message: 'Pizza uspješno obrisana.' });
  } else {
    res.status(404).json({ message: 'Pizza s traženim ID-em ne postoji.' });
  }
});

export default router;

