import express from "express";
const app = express();

// dotnenv je zapravo paket koji ce da nam omoguci da ucitamo sve iz .env fajla kroz process.env (kad god menajmo nesto u .env fajlu moramo da restartujemo server)
import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";
import morgan from "morgan";

// db and authenticatieUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobRoutes.js";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

// ovaj NODE_ENV ce na kraju da doda heroku kad budemo diplojovali nasu aplikacju tamo, tako da ako NODE_ENV nije jednak 'production' pokreni morgan middleware
// morgan biblioteka ce za nas da loguje informacije o zahtevima koji su upuceni naserm serveru (put, post, patch, delete...) takodje ce logovati status code kao i vreme u milisekundama prakticno ono sto smo prosledili unutar morgan funkcije
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// middleware koji ce da nam pomogne da da ocitamo json koji nam stize post metodom sa klijentske strane
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome!" });
});

app.get("/api/v1", (req, res) => {
  res.json({ msg: "API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

//  app.use ce da se pokrene za sve rute koje budemo imali .get, .post, .put, .patch... ali smestamo ga ispod nasih ruta da prvo proveri njih i ukoliko se odkucana ruta ne poklapa ni sa jednom nasom onda ce da pokrene ovaj middleware notFoundMiddlware;
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// prvo zelimo da se konektujemo sa mongo db bazom pa tek onda da pokrenemo nas server
const start = async () => {
  try {
    await connectDB(process.env.MONOGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
