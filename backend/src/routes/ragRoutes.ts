import express, { Request, Response } from 'express';
import { RAGController } from '../controllers/ragController';
import { validateQuery, validateDocument } from '../middleware/validation';

const router = express.Router();
const ragController = new RAGController();

router.post('/query', validateQuery, async (req: Request, res: Response) => {
  await ragController.query(req, res);
});

router.post('/document', validateDocument, async (req: Request, res: Response) => {
  await ragController.addDocument(req, res);
});

export default router;
