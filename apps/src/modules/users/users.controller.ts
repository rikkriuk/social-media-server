import { Controller, Get, Delete, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Op } from 'sequelize';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  @Get()
  async list(
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    const where: any = {};
    if (username) where.username = { [Op.iLike]: `%${username}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (phone) where.phone_number = { [Op.iLike]: `%${phone}%` };

    return this.userModel.findAll({
      attributes: ['uuid', 'email', 'phoneNumber', 'username', 'createdAt'],
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('userId') userId: string) {
    const user = await this.userModel.findOne({ where: { uuid: userId } });
    if (!user) return;
    await user.destroy();
  }
}
