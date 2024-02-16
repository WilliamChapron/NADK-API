const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
cors = require('cors');

const app = express();
const port = 4444;

let spawnedNPCs = []
let spawnedPickups = []
let sessionId = 0;

const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200,
};
  
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Cinematic



app.get('/api/:getSessionId', async (req, res) => {
  if (sessionId == 0) {
    sessionId = req.params.getSessionId
    console.log("First Session ID")
  }
  else {
    if (req.params.getSessionId != sessionId) {
      console.log("Reset Data")
      spawnedNPCs = []
      spawnedPickups = []
    }
    else {
      console.log("Same Session ID")
    }
  }
  res.json({ sessionId: sessionId })
});

app.get('/api/closeSession', async (req, res) => {
  spawnedNPCs = []
  spawnedPickups = []
});

app.get('/api/data/:fileName', async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = `data/${fileName}.json`;

    const data = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des données' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const { fileName, data } = req.body;

    // Vérifiez si le nom de fichier est fourni
    if (!fileName) {
      return res.status(400).json({ error: 'Le nom de fichier est requis.' });
    }

    const filePath = `data/${fileName}.json`;
    
    let existingData = [];

    try {
      const existingDataFile = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(existingDataFile);
    } catch (error) {
      // Le fichier n'existe pas encore
    }

    // Fusionner les données existantes avec les nouvelles données
    const mergedData = existingData.concat(data);

    await fs.writeFile(filePath, JSON.stringify(mergedData, null, 2));

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



app.post('/api/check-and-spawn-pickup', (req, res) => {
  try {
    const { pickupName } = req.body;

    console.log(`Trying to check and spawn Pickup: ${pickupName}`);

    // Vérifiez si le Pickup est déjà spawné en vérifiant la liste des noms
    if (!spawnedPickups.includes(pickupName)) {
      spawnedPickups.push(pickupName);
      console.log(`Pickup ${pickupName} spawned successfully.`);
      res.json({ action: 'SPAWN_PICKUP' });
    } else {
      console.log(`Pickup ${pickupName} already spawned, no action needed.`);
      res.json({ action: 'NO_ACTION' });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification et du spawn du Pickup", error);
    res.status(500).json({ error: 'Erreur lors de la vérification et du spawn du Pickup' });
  }
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
