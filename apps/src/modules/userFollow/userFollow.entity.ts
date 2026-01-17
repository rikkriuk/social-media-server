import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
   tableName: 'user_follows',
   timestamps: true,
   underscored: true,
})
export class UserFollow extends Model {
   @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
   })
   id: string;

   @ForeignKey(() => User)
   @Column({
      type: DataType.UUID,
      allowNull: false,
      field: 'follower_id',
   })
   followerId: string;

   @ForeignKey(() => User)
   @Column({
      type: DataType.UUID,
      allowNull: false,
      field: 'following_id',
   })
   followingId: string;

   @Column({
      type: DataType.DATE,
      defaultValue: DataType.NOW,
   })
   createdAt: Date;

   @BelongsTo(() => User, 'followerId')
   follower: User;

   @BelongsTo(() => User, 'followingId')
   following: User;
}