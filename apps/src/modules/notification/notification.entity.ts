import {
   Table,
   Column,
   Model,
   DataType,
   ForeignKey,
   BelongsTo,
   CreatedAt,
   UpdatedAt,
} from 'sequelize-typescript';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { Profile } from '../profile/profile.model';

@Table({
   tableName: 'notifications',
   timestamps: true,
   underscored: true,
})
export class Notification extends Model {
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
   recipientProfileId: string;

   @BelongsTo(() => Profile, 'recipientProfileId')
   recipient: Profile;

   @ForeignKey(() => Profile)
   @Column({
      type: DataType.UUID,
      allowNull: false,
   })
   actorProfileId: string;

   @BelongsTo(() => Profile, 'actorProfileId')
   actor: Profile;

   @Column({
      type: DataType.ENUM('like', 'comment', 'follow'),
      allowNull: false,
   })
   type: 'like' | 'comment' | 'follow';

   @ForeignKey(() => Post)
   @Column({
      type: DataType.UUID,
      allowNull: true,
   })
   postId: string;

   @BelongsTo(() => Post)
   post: Post;

   @ForeignKey(() => Comment)
   @Column({
      type: DataType.UUID,
      allowNull: true,
   })
   commentId: string;

   @BelongsTo(() => Comment)
   comment: Comment;

   @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
   })
   isRead: boolean;
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
