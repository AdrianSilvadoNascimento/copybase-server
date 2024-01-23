/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';
import { extname } from 'path';

export class MulterOptions {
  static options = {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        return callback(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  };
}
