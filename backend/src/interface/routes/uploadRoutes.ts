import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { upload } from '../../infrastructure/storage/multer';
import { authMiddleware } from '../middlewares/authMiddleware';
import { soloAdmin } from '../middlewares/roleMiddleware';

const uploadController = new UploadController();

export const uploadRouter = Router();

// Subida de archivos de imagen para el catálogo (Solo Admin)
uploadRouter.post(
  '/',
  authMiddleware,
  soloAdmin,
  upload.single('image'),
  uploadController.uploadImage
);
