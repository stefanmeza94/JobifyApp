import express from 'express';
const app = express();

// dotnenv je zapravo paket koji ce da nam omogcu da ucitamo sve iz .env fajla (kad god menajmo nesto u .env fajlu moramo da restartujemo server)
import dotenv from 'dotenv';
dotenv.config();

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.get('/', (req, res) => {
  throw new Error('Error');
  res.send('Welcome!');
});

//  app.use ce da se pokrene za sve rute koje budemo imali .get, .post, .put, .patch... ali smestamo ga ispod nasih ruta da prvo proveri njih i ukoliko se odkucana ruta ne poklapa ni sa jednom nasom onda ce da pokrene ovaj middleware notFoundMiddlware;
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
