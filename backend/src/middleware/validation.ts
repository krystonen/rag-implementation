import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Query validation schema
const querySchema = z.object({
  query: z.string()
    .min(1, 'Query cannot be empty')
    .max(1000, 'Query is too long')
    .trim(),
  k: z.number()
    .int()
    .positive()
    .max(10, 'Maximum number of results is 10')
    .optional()
    .default(3)
});

// Document validation schema
const documentSchema = z.object({
  content: z.string()
    .min(1, 'Document content cannot be empty')
    .max(10000, 'Document content is too long')
    .trim(),
  metadata: z.record(z.unknown())
    .optional()
});

export const validateQuery = (req: Request, res: Response, next: NextFunction): void => {
  try {
    querySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid input',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    next(error);
  }
};

export const validateDocument = (req: Request, res: Response, next: NextFunction): void => {
  try {
    documentSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid input',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    next(error);
  }
}; 