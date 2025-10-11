import { Controller, Get, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  @Get()
  async list() {
    return this.userModel.findAll({ attributes: ['uuid', 'email', 'phoneNumber', 'username', 'createdAt'] });
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('userId') userId: string) {
    const user = await this.userModel.findOne({ where: { uuid: userId } });
    if (!user) return;
    await user.destroy();
  }
}
