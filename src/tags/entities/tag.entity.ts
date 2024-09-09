import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BaseParent } from '../../services/base/base.class';
import { User } from '../../person/user/entities/user.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Entities } from '../../data/enums/strings.enum';

@Entity()
export class Tag extends BaseParent {
  @Column()
  title: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => User)
  lastModifiedBy: User;

  @Column({ default: false })
  isApproved: Boolean;

  @ManyToOne(() => User)
  approvedBy: User;

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    Tag.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    const tagPlain = this;
    const result = await Tag.elasticsearchService.index({
      index: Entities.TAG,
      id: this.id.toString(),
      body: tagPlain,
    });
    console.log(result);
    if (result.result === 'created' || result.result === 'updated')
      console.log("Elastic search did it's job!");
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    await Tag.elasticsearchService.delete({
      index: Entities.TAG,
      id: this.id.toString(),
    });
  }
}
