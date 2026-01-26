import { Table, Column, Model, DataType, ForeignKey, HasOne, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'profile', timestamps: true, underscored: true })
export class Profile extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.UUID })
  userId: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  bio: string;

  @Column({ type: DataType.STRING })
  location: string;

  @Column({ type: DataType.STRING })
  website: string;

  @Column({ type: DataType.STRING })
  gender: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
  
  @BelongsTo(() => User)
  user: User;
}
