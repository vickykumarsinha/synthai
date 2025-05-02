const router = express.Router();
import express from 'express';
import {getUserById, getCoAuthors} from '../controllers/userController.js';
import {createEmptyPaper, getUserPapers, getPaper, saveChanges, deletePaper, removeAuthor} from '../controllers/researchPaperController.js';


router.get('/:id', getUserById);

router.get('/:id/getpapers', getUserPapers);

router.post('/:id/create-new', createEmptyPaper);

router.delete('/:id/delete/:paperId', deletePaper);

router.put('/:id/savechanges/:paperId', saveChanges);

router.get('/:id/getpapers/:paperId', getPaper);

router.get('/:id/getcoauthors', getCoAuthors);

router.put('/:id/remove-author/:paperId', removeAuthor);

export default router;