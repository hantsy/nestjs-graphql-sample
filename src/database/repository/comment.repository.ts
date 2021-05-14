import { EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from '../entity/comment.entity';

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
  //
  findByPostId(id: string): Promise<CommentEntity[]> {
    return this.createQueryBuilder('comment')
      .where('comment.post.id=:id')
      .setParameter('id', id)
      .getMany();
  }
}
