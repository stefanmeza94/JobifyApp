import express from "express";
const router = express.Router();

import { register, login, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(authenticateUser, updateUser);

// moglo je i ovako
// router.post('/register', register);
// router.post('/login', login);
// router.patch('/updateUser',updateUser)

export default router;
