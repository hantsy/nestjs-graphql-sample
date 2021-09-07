import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn('varchar', {
    name: 'id',
  })
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
