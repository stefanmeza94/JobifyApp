import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';

// ako nasa baza bude kompromitovana nas password ce da bude na izvolte napdacu ako stoji kao string, zato je bolja opcija da pre nego sto posaljemo nasu sifru u bazu (monogoDB) da je hash-ujemo. Jednom kada hash-ujemo password ne mozemo vise da ga odhashujemo, jedino sto mozemo jeste da ga storujemo tako hashovan u bazu podataka i prilikom logovanja da uporedmimo uneti password sa nasim hasovanim

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  // posto koristmo paket express-async-errors ne moramo da koristimo ovde trycatch block samim tim ne moramo da koristmo next() funkciju koja ce da gadja sledeci middleware, taj paket ce za nas u pozadini sam da prosledjuje gresku nasem middlewaru (error-handler.js unutar middleware foldera)
  // pre ovoga User.create() pozvace se UserSchema.pre() funkcija koja ce da sakrije password tako sto ce da doda random brojeve i slova oko naseg passworda.
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  // ovde koristimo paket http-status-codes koji ce unutar ovih konstati (CREATE, INTERNAL_SERVER_ERROR  itd) da nam vraca adekvatne brojeve gresaka.
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  res.send('login user');
};

const updateUser = async (req, res) => {
  res.send('update User');
};

export { register, login, updateUser };
