import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  //@PrimaryGeneratedColumn('uuid')
  @Column({ nullable: false, primary: true })
  id: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  name?: string;

  // @OneToMany((type) => PostEntity, (post) => post.author, {
  //   cascade: false,
  // })
  // posts?: Promise<PostEntity[]>;
}
