import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @Column({ name: 'id', generated: false, nullable: false, primary: true })
  id: string;

  @Column({ nullable: true, unique: true, default: 'admin@example.com' })
  email?: string;

  @Column({ nullable: true, default: 'admin' })
  name?: string;

  // @OneToMany((type) => PostEntity, (post) => post.author, {
  //   cascade: false,
  // })
  // posts?: Promise<PostEntity[]>;
}
