import express from 'express';
import nekretnineRouter from './nekretnine.js';

const router = express.Router();

const ponude = [];

const nekretnine = nekretnineRouter.nekretnine;

let brojacPonudaId = 1;

router.post('/', (req, res) => {
    const ponuda = req.body;

    if (ponuda.id_nekretnine == null || !ponuda.ime || !ponuda.prezime || ponuda.cijena == null || !ponuda.telefon) {
        return res.status(400).json({ message: 'Nedostaju podaci o ponudi.' });
    }

    if (ponuda.cijena < 0)
    return res.status(400).json({ message: 'Cijena ponude ne može biti negativna.' });

    const idNekretnine = Number(ponuda.id_nekretnine);

    if (isNaN(idNekretnine)) {
        return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
    }

    const nekretnina = nekretnine.find(n => n.id === idNekretnine);

    if (!nekretnina) {
        return res.status(404).json({ message: 'Nekretnina ne postoji.' });
    }

    const nova_ponuda = {
        id: brojacPonudaId++,
        id_nekretnine: idNekretnine,
        ime: ponuda.ime,
        prezime: ponuda.prezime,
        cijena: ponuda.cijena,
        telefon: ponuda.telefon
    };

    ponude.push(nova_ponuda);

    res.status(200).json(nova_ponuda);
});

export default router;



