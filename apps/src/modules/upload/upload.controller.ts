import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from '../../common/upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: new UploadService().getMulterStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image file' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed (jpeg, png, webp)');
    }

    const fileUrl = this.uploadService.generateFileUrl(file.filename);

    return {
      message: 'Image uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
      },
    };
  }

  @Post('video')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: new UploadService().getMulterStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file' })
  @ApiResponse({ status: 201, description: 'Video uploaded successfully' })
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = ['video/mp4', 'video/quicktime'];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only video files are allowed (mp4, quicktime)');
    }

    const fileUrl = this.uploadService.generateFileUrl(file.filename);

    return {
      message: 'Video uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
      },
    };
  }
}
