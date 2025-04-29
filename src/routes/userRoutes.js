const router = express.Router();
import express from 'express';
import {getUserById, getCoAuthors} from '../controllers/userController.js';
import {createEmptyPaper, getUserPapers, getPaper, saveChanges, deletePaper} from '../controllers/researchPaperController.js';


router.get('/:id', getUserById);

router.get('/:id/getpapers', getUserPapers);

router.post('/:id/create-new', createEmptyPaper);

router.delete('/:id/delete/:paperId', deletePaper);

router.put('/:id/savechanges/:paperId', saveChanges);

router.get('/:id/getpapers/:paperId', getPaper);

router.get('/:id/getcoauthors', getCoAuthors);

export default router;