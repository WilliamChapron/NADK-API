const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
cors = require('cors');

const app = express();
const port = 4444;
const dataFilePath = 'data.json';



const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200,
};
  
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des données' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    let existingData = [];

    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      existingData = JSON.parse(data);
    } catch (error) {
    }

    existingData.push(newData);

    await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'écriture des données' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
