import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne((type) => UserEntity, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
