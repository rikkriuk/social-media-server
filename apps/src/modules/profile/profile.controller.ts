import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'List profiles (filter by userId or name)' })
  async list(@Query('userId') userId: string, @Query('name') name: string, @Query('username') username: string) {
    const filter: any = {};
    if (userId) filter.userId = parseInt(userId, 10);
    if (name) filter.name = name;
    if (username) filter.username = username;
    return this.service.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by id' })
  async get(@Param('id') id: string) {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  @ApiOperation({ summary: 'Create profile for user' })
  async create(@Body() dto: CreateProfileDto) {
    return this.service.create((dto as any).userId, dto as CreateProfileDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update profile (partial)' })
  async patch(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.service.update(parseInt(id, 10), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  async delete(@Param('id') id: string) {
    return this.service.remove(parseInt(id, 10));
  }
}
