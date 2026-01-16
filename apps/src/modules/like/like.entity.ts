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
import { Profile } from '../profile/profile.model';

@Table({
   tableName: 'likes',
   timestamps: true,
   underscored: true,
})
export class Like extends Model {
   @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
   })
   id: string;

   @ForeignKey(() => Post)
   @Column({
      type: DataType.UUID,
      allowNull: false,
   })
   postId: string;

   @BelongsTo(() => Post)
   post: Post;

   @ForeignKey(() => Profile)
   @Column({
      type: DataType.UUID,
      allowNull: false,
   })
   profileId: string;

   @BelongsTo(() => Profile)
   profile: Profile;

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
