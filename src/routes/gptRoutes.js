import express from 'express';
import {gptSearch} from '../controllers/gptController.js';
const router = express.Router();

router.post('/chat', gptSearch);

export default router;  