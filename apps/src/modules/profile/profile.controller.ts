import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileFilterDto } from './dto/profile-filter.dto';
import { paginateResponse } from '../../common/response.helper';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiProfileQuery } from './dto/profile-filter.dto';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'List profiles (filter by userId or name)' })
  @ApiProfileQuery()
  async list(@Req() req: Request, @Query() filter: ProfileFilterDto) {
    const result = (await this.service.findAll(filter as any, true)) as any;
    const { rows, count, limit, offset } = result;
    return paginateResponse(req, rows, count, limit || 50, offset || 0);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by id' })
  async get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create profile for user' })
  async create(@Body() dto: CreateProfileDto) {
    return this.service.create((dto as any).userId, dto as CreateProfileDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update profile (partial)' })
  async patch(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  async delete(@Param('id') id: string) {
    return this.service.remove(parseInt(id, 10));
  }
}
