import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName?: string;

  @Column()
  email: string;

  // @OneToMany((type) => PostEntity, (post) => post.author, {
  //   cascade: false,
  // })
  // posts?: Promise<PostEntity[]>;
}
