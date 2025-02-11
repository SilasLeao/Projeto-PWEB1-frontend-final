const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3200;

const corsOptions = {
  origin: 'http://localhost:4200', // Apenas permita requisições do Angular
};
// Habilita o CORS para todas as origens
app.use(cors(corsOptions));

// Configuração do Multer para salvar arquivos na pasta 'assets/imgs'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('assets', 'imgs'));  // Caminho absoluto para a pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nome único baseado na data
  }
});

const upload = multer({ storage: storage });

// Configuração para servir arquivos estáticos da pasta 'assets/imgs'
app.use('/assets/imgs', express.static(path.join(__dirname, 'assets', 'imgs')));



// Endpoint para o upload da imagem
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send('Nenhuma imagem foi carregada');
  }

  // Retorna a URL completa da imagem para o frontend
  const imageUrl = `${req.file.filename}`;
  console.log(imageUrl)
  res.send({ imageUrl });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
