import {
   Table,
   Column,
   Model,
   DataType,
   ForeignKey,
   BelongsTo,
   HasMany,
   CreatedAt,
   UpdatedAt,
} from 'sequelize-typescript';
import { Like } from '../like/like.entity';
import { Comment } from '../comment/comment.entity';
import { Profile } from '../profile/profile.model';

@Table({
   tableName: 'posts',
   timestamps: true,
   underscored: true,
})
export class Post extends Model {
   @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
   })
   id: string;

   @ForeignKey(() => Profile)
   @Column({
      type: DataType.UUID,
      allowNull: false,
   })
   profileId: string;

   @BelongsTo(() => Profile)
   profile: Profile;

   @Column({
      type: DataType.TEXT,
      allowNull: false,
   })
   content: string;

   @Column({
      type: DataType.JSON,
      allowNull: true,
   })
   mediaIds: string[];

   @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
   })
   likesCount: number;

   @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
   })
   commentsCount: number;

   @HasMany(() => Like)
   likes: Like[];

   @HasMany(() => Comment)
   comments: Comment[];

   @CreatedAt
   @Column({
      type: DataType.DATE,
      defaultValue: DataType.NOW,
   })
   createdAt: Date;

   @UpdatedAt
   @Column({
      type: DataType.DATE,
      defaultValue: DataType.NOW,
   })
   updatedAt: Date;
}