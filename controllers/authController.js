import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  // posto koristmo paket express-async-errors ne moramo da koristimo ovde trycatch block samim tim ne moramo da koristmo next() funkciju koja ce da gadja sledeci middleware, taj paket ce za nas u pozadini sam da prosledjuje gresku nasem middlewaru (error-handler.js unutar middleware foldera)
  const user = await User.create({ name, email, password });
  // ovde koristimo paket http-status-codes koji ce unutar ovih konstati (CREATE, INTERNAL_SERVER_ERROR  itd) da nam vraca adekvatne brojeve gresaka.
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  res.send("login user");
};

const updateUser = async (req, res) => {
  res.send("update User");
};

export { register, login, updateUser };
