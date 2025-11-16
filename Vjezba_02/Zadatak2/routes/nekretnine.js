import express from 'express';
const router = express.Router();

const nekretnine = []

router.nekretnine = nekretnine;


router.get('/', (req, res) => {
  res.status(200).json(nekretnine);
});


router.get('/:id', (req,res) => {
  const id = Number(req.params.id)

  if(isNaN(id))
     return res.status(400).json({ message: 'ID mora biti broj.' })

  const nekretnina = nekretnine.find(n => n.id === id)
  
  if (!nekretnina) 
    return res.status(404).json({ message: 'Nekretnina nije pronađena.' });

  res.status(200).json(nekretnina);

})


let brojacId = 1;

router.post('/', (req,res) => {
    const nekretnina = req.body
    
    if(!nekretnina.naziv || !nekretnina.opis || nekretnina.cijena == null || !nekretnina.lokacija || nekretnina.broj_soba == null || nekretnina.povrsina == null){
        return res.status(400).json({ message: 'Nisu upisani svi podaci o nekretnini.' });
    }
    if (nekretnina.cijena < 0 || nekretnina.broj_soba < 0 || nekretnina.povrsina < 0) {
        return res.status(400).json({ message: 'Određene vrijednosti su negativne.' });
    }

    const nova_nekretnina = {
        id: brojacId++,
        naziv: nekretnina.naziv,
        opis: nekretnina.opis,
        cijena: nekretnina.cijena,
        lokacija:  nekretnina.lokacija,
        broj_soba: nekretnina.broj_soba,
        povrsina: nekretnina.povrsina
    };

     nekretnine.push(nova_nekretnina);

     res.status(200).json(nova_nekretnina);
})

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const nekretnina = req.body;

  if (isNaN(id))
    return res.status(400).json({ message: 'ID mora biti broj.' });

  const index = nekretnine.findIndex(n => n.id === id);

  if (index === -1)
    return res.status(404).json({ message: 'Nekretnina nije pronađena.' });

  if (!nekretnina.naziv || !nekretnina.opis || nekretnina.cijena == null || !nekretnina.lokacija || nekretnina.broj_soba == null || nekretnina.povrsina == null) {
    return res.status(400).json({ message: 'Nisu upisani svi podaci o nekretnini.' });
  }

  if (nekretnina.cijena < 0 || nekretnina.broj_soba < 0 || nekretnina.povrsina < 0) {
    return res.status(400).json({ message: 'Određene vrijednosti su negativne.' });
  }

  nekretnine[index] = {
    id,
    naziv: nekretnina.naziv,
    opis: nekretnina.opis,
    cijena: nekretnina.cijena,
    lokacija: nekretnina.lokacija,
    broj_soba: nekretnina.broj_soba,
    povrsina: nekretnina.povrsina
  };

  res.status(200).json(nekretnine[index]);
});


router.patch('/:id', (req, res) => {

  const id = Number(req.params.id);
  const izmjene = req.body;

  if (isNaN(id))
    return res.status(400).json({ message: 'ID mora biti broj.' });

  const index = nekretnine.findIndex(n => n.id === id);

  if (index === -1)
    return res.status(404).json({ message: 'Nekretnina nije pronađena.' });

  if (izmjene.cijena !== undefined && izmjene.cijena < 0)
    return res.status(400).json({ message: 'Cijena ne može biti negativna.' });

  if (izmjene.cijena !== undefined && typeof izmjene.cijena !== 'number')
    return res.status(400).json({ message: 'Cijena mora biti broj.' });

  if (izmjene.broj_soba !== undefined && izmjene.broj_soba < 0)
    return res.status(400).json({ message: 'Broj soba ne može biti negativan.' });

  if (izmjene.povrsina !== undefined && izmjene.povrsina < 0)
    return res.status(400).json({ message: 'Površina ne može biti negativna.' });

  
  for (let key in izmjene) {
    nekretnine[index][key] = izmjene[key];
  }

  res.status(200).json(nekretnine[index]);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ message: 'ID mora biti broj.' });

  const index = nekretnine.findIndex(n => n.id === id);

  if (index === -1)
    return res.status(404).json({ message: 'Nekretnina nije pronađena.' });

  nekretnine.splice(index, 1);

  res.status(200).json({ message: 'Nekretnina uspješno obrisana.' });
});


export default router;