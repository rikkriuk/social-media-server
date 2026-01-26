import { Controller, Get, Delete, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Op } from 'sequelize';
import { UserFilterDto } from './dto/user-filter.dto';
import { paginateResponse } from '../../common/response.helper';
import { ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  @Get()
  async list(@Query() filter: UserFilterDto) {
    const where: any = {};
    if (filter.username) where.username = { [Op.iLike]: `%${filter.username}%` };
    if (filter.email) where.email = { [Op.iLike]: `%${filter.email}%` };
    if (filter.phone) where.phone_number = { [Op.iLike]: `%${filter.phone}%` };

    const lim = filter.limit || 50;
    const off = filter.offset || 0;
    const { rows, count } = await this.userModel.findAndCountAll({
      attributes: ['id', 'email', 'phoneNumber', 'username', 'createdAt'],
      where,
      limit: lim,
      offset: off,
    });
    return paginateResponse(rows, count, lim, off);
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', required: true, type: String })
  async getUserById(@Param('userId') userId: string) {
    const user = await this.userModel.findOne({
      where: { id: userId },
    })

    return user;
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('userId') userId: string) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) return;
    await user.destroy();
  }
}
