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

    // Fusionner les données existantes avec les nouvelles données
    const mergedData = existingData.concat(newData);

    await fs.writeFile(dataFilePath, JSON.stringify(mergedData, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'écriture des données' });
  }
});

app.post('/api/check-and-spawn-npc', (req, res) => {
  try {
    const { npcName } = req.body;

    console.log(`Trying to check and spawn NPC: ${npcName}`);

    // Vérifiez si le NPC est déjà spawné en vérifiant la liste des noms
    if (!spawnedNPCs.includes(npcName)) {
      spawnedNPCs.push(npcName);
      console.log(`NPC ${npcName} spawned successfully.`);
      res.json({ action: 'SPAWN_NPC' });
    } else {
      console.log(`NPC ${npcName} already spawned, no action needed.`);
      res.json({ action: 'NO_ACTION' });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification et du spawn du NPC", error);
    res.status(500).json({ error: 'Erreur lors de la vérification et du spawn du NPC' });
  }
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
