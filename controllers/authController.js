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

  // prvo proveravamo da li fali jedan od inputa
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  // prvo nalazimo usera sa tim email koji je korisnik iskucao u login input, da vidimo da li postoji u bazi
  // User.findOne() metoda nece da vrati password jer smo rekli u user skimi da select ima vrednost false za password i zato moramo da dodamo select metodu ovde ('+password')
  // pravice problem tamo u user.comparePassword kada pristupamo this.password (undefined) ukoliko ne prosledimo select() metodu!
  const user = await User.findOne({ email }).select('+password');
  // ukoliko user sa tim email ne postoji vracamo gresku
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  // ako user sa tim email postoji onda hocemo da uporedimo password
  const isPasswordCorrect = await user.comparePassword(password);
  // saljemo gresku ako se uneti password ne pokalapa sa passwordom od usera ciji je email unet
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const token = await user.createJWT();

  // ovde mozemo opet da hardkodiramo da ne vracamo celog usera kao sto vracamo u register kontroleru (sa sve passwordom jer nije najbolja praksa da saljemo i password na front), dok je druga opcija da setujemo password od usera na undefined!
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  // posto smo ovde koristili save() metodu ona ce da pokrene .pre() metodu unutar user modala i dobicemo gresku. Da smo koristili npr User.findOneAndUpdate() ona bi zaobisla .pre metodu. Kako mozemo da izbegnemo ovo ponasanje sa save() metodom, tako sto cemo da koristimo this.modifiedPaths() ili this.isModified() funkcije unutar .pre() funkcije i oni ce da proveravaju da li je neki od propertija unutar usera menjan.
  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export { register, login, updateUser };
