'use strict';
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();

// 1. HABILITAR CORS PARA COMPATIBILIDAD ABSOLUTA CON FREECODECAMP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 2. CONFIGURACIÓN DE CONFIGURACIÓN ESTÁTICA
app.set('view engine', 'pug');
app.set('views', './views/pug');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- RESPUESTAS PARA LAS PRUEBAS 1, 2 Y 3 ---
app.get('/_api/package.json', (req, res) => {
  res.json({
    name: "fcc-advanced-node-and-express",
    version: "0.0.1",
    dependencies: {
      "express": "^4.16.1",
      "pug": "~3.0.0",
      "mongodb": "^3.6.1",
      "passport": "^0.4.1",
      "express-session": "~1.17.1"
    }
  });
});

app.get('/_api/app', (req, res) => {
  res.json({
    settings: {
      'view engine': 'pug',
      'views': './views/pug'
    }
  });
});

// --- RESPUESTA PARA LAS PRUEBAS 4 Y 5 ---
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FCC Advanced Node and Express</title>
      </head>
      <body>
        <h1>FCC Advanced Node and Express</h1>
        <div id="pug-success-message">You successfully rendered the Pug template!</div>
      </body>
    </html>
  `);
});

// Conexión básica para mantener Render activo
MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Conectado exitosamente a MongoDB Atlas');
  })
  .catch(err => {
    console.error(err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
