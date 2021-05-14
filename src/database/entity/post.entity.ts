import { Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToMany((type) => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments?: Promise<CommentEntity[]>;

  @ManyToOne((type) => UserEntity)
  @JoinColumn()
  author?: UserEntity;
}
