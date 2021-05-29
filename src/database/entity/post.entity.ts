import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  content?: string;

  @OneToMany((type) => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments?: Promise<CommentEntity[]>;

  @ManyToOne((type) => UserEntity, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: UserEntity;

  @RelationId((post: PostEntity) => post.author)
  authorId?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}
