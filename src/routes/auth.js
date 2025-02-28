const router = express.Router();
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';


router.post('/register', registerUser);
router.post('/login', loginUser);


export default router;