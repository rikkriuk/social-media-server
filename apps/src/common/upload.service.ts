import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
   getMulterStorage() {
      return diskStorage({
         destination: (req, file, cb) => {
         const uploadDir = './uploads';
         cb(null, uploadDir);
         },
         filename: (req, file, cb) => {
         const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
         const ext = extname(file.originalname);
         cb(null, `${uniqueSuffix}${ext}`);
         },
      });
   }

   getMulterOptions() {
      return {
         storage: this.getMulterStorage(),
         limits: {
         fileSize: 10 * 1024 * 1024, // 10MB
         },
         fileFilter: (req: any, file: any, cb: any) => {
         const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/quicktime',
         ];

         if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
         } else {
            cb(
               new Error(
               'Only image and video files are allowed (jpeg, png, gif, webp, mp4, quicktime)',
               ),
               false,
            );
         }
         },
      };
   }

   generateFileUrl(filename: string): string {
      return `/uploads/${filename}`;
   }
}
