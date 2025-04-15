const router = express.Router();
import express from 'express';
import getUserById from '../controllers/userController.js';
import {addResearchPaper, getUserPapers, getPaper, saveChanges, deletePaper} from '../controllers/researchPaperController.js';


router.get('/:id', getUserById);

router.get('/:id/getpapers', getUserPapers);

router.post('/:id/savepapers', addResearchPaper);

router.delete('/:id/delete/:paperId', deletePaper);

router.put('/:id/savechanges/:paperId', saveChanges);

router.get('/:id/getpapers/:paperId', getPaper);

export default router;