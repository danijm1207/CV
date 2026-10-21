import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors/AppError';

export class UploadController {
  uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new ValidationError('No se proporcionó ningún archivo de imagen');
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(201).json({
        message: 'Imagen subida exitosamente',
        url: imageUrl,
      });
    } catch (error) {
      next(error);
    }
  };
}
