require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Configuration Azure Blob Storage
const STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT || 'stnodepii12o';
const STORAGE_KEY = process.env.AZURE_STORAGE_KEY;
const connectionString = `DefaultEndpointsProtocol=https;AccountName=${STORAGE_ACCOUNT};AccountKey=${STORAGE_KEY};EndpointSuffix=core.windows.net`;

let blobServiceClient;
if (STORAGE_KEY) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
}

// Servir le fichier HTML
app.use(express.static('.'));

app.get('/api/info', (req, res) => {
  res.json({
    storage_account: STORAGE_ACCOUNT,
    storage_configured: !!STORAGE_KEY,
    timestamp: new Date().toISOString()
  });
});

// Liste tous les conteneurs
app.get('/api/containers', async (req, res) => {
  if (!blobServiceClient) {
    return res.status(500).json({ error: 'Storage non configure' });
  }
  try {
    const containers = [];
    for await (const container of blobServiceClient.listContainers()) {
      containers.push(container.name);
    }
    res.json({ containers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Liste les fichiers d'un conteneur
app.get('/api/files/:container', async (req, res) => {
  if (!blobServiceClient) {
    return res.status(500).json({ error: 'Storage non configure' });
  }
  try {
    const containerClient = blobServiceClient.getContainerClient(req.params.container);
    const files = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      files.push({
        name: blob.name,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
      });
    }
    res.json({ container: req.params.container, files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload un fichier
app.post('/api/upload/:container', upload.single('file'), async (req, res) => {
  if (!blobServiceClient) {
    return res.status(500).json({ error: 'Storage non configure' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }

  const container = req.params.container;
  const fileType = req.file.mimetype;

  if (container === 'images' && !fileType.startsWith('image/')) {
    return res.status(400).json({ error: 'Le conteneur images accepte seulement des images' });
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(req.file.originalname);
    await blockBlobClient.upload(req.file.buffer, req.file.size);
    res.json({
      message: 'Fichier uploade avec succes',
      filename: req.file.originalname,
      container: container,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Telecharge un fichier
app.get('/api/download/:container/:filename', async (req, res) => {
  if (!blobServiceClient) {
    return res.status(500).json({ error: 'Storage non configure' });
  }
  try {
    const containerClient = blobServiceClient.getContainerClient(req.params.container);
    const blockBlobClient = containerClient.getBlockBlobClient(req.params.filename);
    const downloadResponse = await blockBlobClient.download(0);
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
    downloadResponse.readableStreamBody.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprime un fichier
app.delete('/api/delete/:container/:filename', async (req, res) => {
  if (!blobServiceClient) {
    return res.status(500).json({ error: 'Storage non configure' });
  }
  try {
    const containerClient = blobServiceClient.getContainerClient(req.params.container);
    const blockBlobClient = containerClient.getBlockBlobClient(req.params.filename);
    await blockBlobClient.delete();
    res.json({
      message: 'Fichier supprime avec succes',
      filename: req.params.filename,
      container: req.params.container
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur demarre sur http://0.0.0.0:${PORT}`);
  console.log(`Storage Account: ${STORAGE_ACCOUNT}`);
  console.log(`Storage configured: ${!!STORAGE_KEY}`);
});
