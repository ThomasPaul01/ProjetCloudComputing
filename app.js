const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Application Node.js deployee sur Azure</h1>
    <p>Projet Cloud Computing - TP Terraform</p>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur demarre sur http://0.0.0.0:${PORT}`);
});
