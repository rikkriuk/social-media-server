import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { User } from '../users/user.model';
import { Op } from 'sequelize';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private profileModel: typeof Profile) {}

  async create(userId: number, dto: CreateProfileDto) {
    return this.profileModel.create({ userId, ...dto });
  }

  async findAll(filter: { userId?: number; name?: string; username?: string }) {
    const where: any = {};
    const include: any = [];
    if (filter.userId) where.userId = filter.userId;
    if (filter.name) where.name = filter.name;
    if (filter.username) {
      include.push({ model: User, where: { username: { [Op.iLike]: `%${filter.username}%` } }, attributes: ['uuid', 'username'] });
    }
    return this.profileModel.findAll({ where, include });
  }

  async findOne(id: number) {
    return this.profileModel.findByPk(id);
  }

  async update(id: number, dto: UpdateProfileDto) {
    const p = await this.profileModel.findByPk(id);
    if (!p) return null;
    return p.update(dto);
  }

  async remove(id: number) {
    const p = await this.profileModel.findByPk(id);
    if (!p) return null;
    await p.destroy();
    return { success: true };
  }
}
