import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import ragRoutes from './routes/ragRoutes';
import documentRoutes from './routes/documentRoutes';
import { validateApiKey } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all routes
app.use(limiter);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the RAG Implementation API');
});

// Protected routes with API key validation
app.use('/api/rag', validateApiKey, ragRoutes);
app.use('/api/documents', validateApiKey, documentRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});