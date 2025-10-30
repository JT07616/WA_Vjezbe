const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
res.sendFile(__dirname + "/public/index.html");
});

app.get('/about', (req, res) => {
res.sendFile(__dirname + "/public/about.html");
});

app.get('/users', (req, res) => {
  const users = [
    {id: 1, ime: 'Ana', prezime: 'Anić'},
    {id: 2, ime: 'Ena', prezime: 'Erceg'},
    {id: 3, ime: 'Fran', prezime: 'Franić'},
    {id: 4, ime: 'Goran', prezime: 'Gašpar'},
    {id: 5, ime: 'Hrvoje', prezime: 'Horvat'}
  ]
  res.json(users)
});



app.listen(PORT, error => {
if (error) {
console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
} else {
console.log(`Server je pokrenut na http://localhost:${PORT}`);
}
});
