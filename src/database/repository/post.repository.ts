import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '../entity/post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  findAll(q: string, offset: number, limit: number): Promise<PostEntity[]> {
    return this.createQueryBuilder('p')
      .where('p.title like :q or p.content like :q')
      .setParameter('q', '%' + q + '%')
      .skip(offset)
      .take(limit)
      .getMany();
  }

  findByAuthor(id: string): Promise<PostEntity[]> {
    return this.manager.find(PostEntity, { author: { id: id } });
  }
}
