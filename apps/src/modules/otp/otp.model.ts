import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'otp_codes', timestamps: false, underscored: true })
export class OtpCode extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.UUID })
  userId: string;

  @Column({ type: DataType.STRING(6) })
  code: string;

  @Column({ field: 'expires_at', type: DataType.DATE })
  expiresAt: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  verified: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  used: boolean;

  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;
}
