/* eslint-disable prettier/prettier */
import * as multer from 'multer';
import { MulterOptions } from './multer.options';

export const multerMiddleware = multer(MulterOptions.options).single('file');
