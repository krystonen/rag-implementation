import express, { Request, Response } from 'express';
import { RAGController } from '../controllers/ragController';


const router = express.Router();
const ragController = new RAGController();

router.post('/query', async (req: Request, res: Response) => {
  await ragController.query(req, res);
});

router.post('/document', async (req: Request, res: Response) => {
  await ragController.addDocument(req, res);
});

export default router;
