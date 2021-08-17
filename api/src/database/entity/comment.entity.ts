import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne((type) => PostEntity, (p) => p.comments)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @RelationId((comment: CommentEntity) => comment.post)
  postId?: string;

  @ManyToOne((type) => UserEntity, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: UserEntity;

  @RelationId((comment: CommentEntity) => comment.author)
  authorId?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
