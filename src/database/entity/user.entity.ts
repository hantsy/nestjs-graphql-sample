import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName?: string;

  @Column({ unique: true })
  email: string;

  // @OneToMany((type) => PostEntity, (post) => post.author, {
  //   cascade: false,
  // })
  // posts?: Promise<PostEntity[]>;
}
