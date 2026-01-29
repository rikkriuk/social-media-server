import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, HttpException, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileFilterDto } from './dto/profile-filter.dto';
import { paginateResponse, singleResponse } from '../../common/response.helper';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ApiProfileQuery } from './dto/profile-filter.dto';
import { UploadService } from '../../common/upload.service';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  constructor(
    private service: ProfileService,
    private uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List profiles (filter by userId or name)' })
  @ApiProfileQuery()
  async list(@Query() filter: ProfileFilterDto) {
    const result = (await this.service.findAll(filter as any, true)) as any;
    const { count, results, limit, offset } = result.payload;
    return paginateResponse(results, count, limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by id' })
  async get(@Param('id') id: string) {
    const profile = await this.service.findOne(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return singleResponse(profile);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create profile for user' })
  async create(@Request() req: any, @Body() dto: CreateProfileDto) {
    const userId = req.user.userId;
    const profile = await this.service.create(userId, dto);
    return singleResponse(profile);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update profile (partial)' })
  async patch(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    const profile = await this.service.update(id, dto);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return singleResponse(profile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  async delete(@Param('id') id: string) {
    const result = await this.service.remove(parseInt(id, 10));
    if (!result) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return singleResponse(result);
  }

  @Post(':id/upload-image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: new UploadService().getMulterStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiResponse({ status: 201, description: 'Profile image uploaded' })
  async uploadProfileImage(
    @Param('id') profileId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new HttpException(
        'Only image files are allowed (jpeg, png, gif, webp)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fileUrl = this.uploadService.generateFileUrl(file.filename);
    const profile = await this.service.updateProfileImage(profileId, file.filename);

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return singleResponse(profile);
  }
}
