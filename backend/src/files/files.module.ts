import { Module } from '@nestjs/common';
import { FilesService } from './files.service'
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = `${uuidv4()}${ext}`;
          cb(null, fileName);
        }
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Seules les images sont autorisées'), false);
        }
        callback(null, true);
      }    
    })
  ],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
