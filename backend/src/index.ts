import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ragRoutes from './routes/ragRoutes';
import documentRoutes from './routes/documentRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the RAG Implementation API');
});

// RAG routes
app.use('/api/rag', ragRoutes);

// Document processing routes
app.use('/api/documents', documentRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});