const router = express.Router();
import express from 'express';
import getUserById from '../controllers/userController.js';
import {addResearchPaper, getUserPapers} from '../controllers/researchPaperController.js';


router.get('/:id', getUserById);

router.get('/:id/getpapers', getUserPapers);

router.post('/:id/savepapers', addResearchPaper);

export default router;