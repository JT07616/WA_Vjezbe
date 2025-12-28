import express from "express";
import fs from "fs/promises";

const app = express();
app.use(express.json());

const PATH = "data/zaposlenici.json";

async function ucitajZaposlenike() {
  const data = await fs.readFile(PATH, "utf8");
  return JSON.parse(data);
}

async function spremiZaposlenike(zaposlenici) {
  await fs.writeFile(PATH, JSON.stringify(zaposlenici, null, 2), "utf8");
}

app.get("/zaposlenici", async (req, res) => {
  const sortiraj_po_godinama = req.query.sortiraj_po_godinama;
  const pozicija = req.query.pozicija;
  const godine_staza_min = req.query.godine_staza_min;
  const godine_staza_max = req.query.godine_staza_max;

  try {
    let zaposlenici = await ucitajZaposlenike();

    if (!Array.isArray(zaposlenici)) {
      return res.status(500).send("Neispravan format datoteke zaposlenici.json.");
    }

    if (zaposlenici.length === 0) {
      return res.status(404).send("Nema zaposlenika.");
    }

    if (pozicija) {
      zaposlenici = zaposlenici.filter(z => z.pozicija === pozicija);
    }

    if (godine_staza_min) {
      const min = parseInt(godine_staza_min, 10);

      if (isNaN(min)) return res.status(400).send("godine_staza_min mora biti broj.");

      zaposlenici = zaposlenici.filter(z => z.godine_staza >= min);
    }

    if (godine_staza_max) {
      const max = parseInt(godine_staza_max, 10);

      if (isNaN(max)) return res.status(400).send("godine_staza_max mora biti broj.");

      zaposlenici = zaposlenici.filter(z => z.godine_staza <= max);
    }

    if (zaposlenici.length === 0) {
      return res.status(404).send("Nema zaposlenika koji odgovaraju uvjetima.");
    }

    if (sortiraj_po_godinama) {

      if (sortiraj_po_godinama === "uzlazno") {
        zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza);

      } else if (sortiraj_po_godinama === "silazno") {
        zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza);

      } else {
        return res
          .status(400)
          .send("sortiraj_po_godinama mora biti 'uzlazno' ili 'silazno'.");
      }
    }

    return res.status(200).json(zaposlenici);

  } catch (error) {
    console.error("Greška prilikom čitanja datoteke:", error);
    return res.status(500).send("Greška prilikom čitanja datoteke.");
  }
});

app.get("/zaposlenici/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send("ID mora biti broj.");
  }

  try {
    const zaposlenici = await ucitajZaposlenike();

    if (!Array.isArray(zaposlenici)) {
      return res.status(500).send("Neispravan format datoteke zaposlenici.json.");
    }

    if (zaposlenici.length === 0) {
      return res.status(404).send("Nema zaposlenika.");
    }

    const zaposlenik = zaposlenici.find(z => z.id === id);

    if (!zaposlenik) {
      return res.status(404).send("Zaposlenik nije pronađen.");
    }

    return res.status(200).json(zaposlenik);
  } catch (error) {
    console.error("Greška prilikom čitanja datoteke:", error);
    return res.status(500).send("Greška prilikom čitanja datoteke.");
  }
});

app.post("/zaposlenici", async (req, res) => {
  const { ime, prezime, godine_staza, pozicija } = req.body;

  if (!ime || !prezime || godine_staza === undefined || !pozicija) {
    return res.status(400).send("Niste poslali sve podatke (ime, prezime, godine_staza, pozicija).");
  }

  if (typeof ime !== "string" || typeof prezime !== "string" || typeof pozicija !== "string") {
    return res.status(400).send("Ime, prezime i pozicija moraju biti stringovi.");
  }

  const gs = Number(godine_staza);

  if (Number.isNaN(gs)) {
    return res.status(400).send("godine_staza mora biti broj.");
  }

  if (gs < 0) {
    return res.status(400).send("godine_staza mora biti pozitivan broj.");
  }

  try {
    const zaposlenici = await ucitajZaposlenike();

    if (!Array.isArray(zaposlenici)) {
      return res.status(500).send("Neispravan format datoteke zaposlenici.json.");
    }

    let maxId = 0;
    for (let i = 0; i < zaposlenici.length; i++) {
      if (zaposlenici[i].id > maxId) maxId = zaposlenici[i].id;
    }

    const novi = {
      id: maxId + 1,
      ime: ime.trim(),
      prezime: prezime.trim(),
      godine_staza: gs,
      pozicija: pozicija.trim()
    };

    zaposlenici.push(novi);
    await spremiZaposlenike(zaposlenici);

    return res.status(201).json(novi);
  } catch (error) {
    console.error("Greška prilikom pohrane u datoteku:", error);
    return res.status(500).send("Greška prilikom pohrane u datoteku.");
  }
});

app.listen(3000, () => {
  console.log("Server radi na http://localhost:3000");
});