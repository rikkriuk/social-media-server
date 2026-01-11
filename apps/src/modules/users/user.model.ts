import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false, underscored: true })
export class User extends Model {
  @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  email: string;

  @Column({ field: 'phone_number', type: DataType.STRING, allowNull: true })
  phoneNumber: string;

  @Column({ type: DataType.STRING, allowNull: true })
  username: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ field: 'is_verified', type: DataType.BOOLEAN, defaultValue: false })
  isVerified: boolean;

  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;
}
