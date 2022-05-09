import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

const register = async (req, res) => {
  // posto koristmo paket express-async-errors ne moramo da koristimo ovde trycatch block samim tim ne moramo da koristmo next() funkciju koja ce da gadja sledeci middleware, taj paket ce za nas u pozadini sam da prosledjuje gresku nasem middlewaru (error-handler.js unutar middleware foldera)
  const user = await User.create(req.body);
  // ovde koristimo paket http-status-codes koji ce unutar ovih konstati (CREATE, INTERNAL_SERVER_ERROR  itd) da nam vraca adekvatne brojeve gresaka.
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  res.send('login user');
};

const updateUser = async (req, res) => {
  res.send('update User');
};

export { register, login, updateUser };
