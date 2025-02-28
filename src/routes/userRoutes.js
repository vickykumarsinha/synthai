const router = express.Router();
import express from 'express';
import getUserById from '../controllers/userController.js';
import {getUserPapers} from '../controllers/researchPaperController.js';


router.get('/:id', getUserById);

router.get('/:id/getpapers', getUserPapers);

export default router;