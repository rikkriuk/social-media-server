import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileFilterDto } from './dto/profile-filter.dto';
import { paginateResponse, singleResponse } from '../../common/response.helper';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiProfileQuery } from './dto/profile-filter.dto';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  constructor(private service: ProfileService) {}

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
  @ApiOperation({ summary: 'Create profile for user' })
  async create(@Body() dto: CreateProfileDto) {
    const profile = await this.service.create((dto as any).userId, dto as CreateProfileDto);
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
}
