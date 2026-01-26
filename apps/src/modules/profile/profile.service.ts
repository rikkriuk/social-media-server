import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { User } from '../users/user.model';
import { Op } from 'sequelize';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { paginateResponse } from '../../common/response.helper';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private profileModel: typeof Profile) {}

  async create(userId: string, dto: CreateProfileDto) {
    return this.profileModel.create({ userId, ...dto });
  }

  async findAll(
    filter: { userId?: string; name?: string; username?: string; limit?: number; offset?: number },
    paginate = false,
  ) {
    const where: any = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };

    const userInclude: any = { model: User, attributes: ['id', 'username', 'email'] };
    if (filter.username) {
      userInclude.where = { username: { [Op.iLike]: `%${filter.username}%` } };
    }

    if (!paginate) {
      return this.profileModel.findAll({ where, include: [userInclude] });
    }

    const limit = filter.limit || 50;
    const offset = filter.offset || 0;
    const result = await this.profileModel.findAndCountAll({ where, include: [userInclude], limit, offset });
    return paginateResponse(result.rows, result.count, limit, offset);
  }

  async findOne(id: string) {
    return this.profileModel.findOne({
      where: { id },
      include: [{ model: User, attributes: ['id', 'username', 'email'] }],
    });
  }

  async update(id: string, dto: UpdateProfileDto) {
    const p = await this.profileModel.findOne({ where: { id } });
    if (!p) return null;
    return p.update(dto);
  }

  async remove(id: number) {
    const p = await this.profileModel.findOne({ where: { id } });
    if (!p) return null;
    await p.destroy();
    return { success: true };
  }
}
