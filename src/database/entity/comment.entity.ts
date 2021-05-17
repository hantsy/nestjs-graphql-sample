import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne((type) => PostEntity, (p) => p.comments)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  public static of(comment: string): CommentEntity {
    const c = new CommentEntity();
    c.content = comment;
    return c;
  }
}
