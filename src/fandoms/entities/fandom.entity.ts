import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseParent } from '../../services/base/base.class';
import { User } from '../../person/user/entities/user.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Entities } from '../../data/enums/strings.enum';

@Entity()
@Unique(['title'])
export class Fandom extends BaseParent {
  @Column()
  title: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => User)
  lastModifiedBy: User;

  @Column({ default: false })
  isApproved: Boolean;

  @ManyToOne(() => User, { nullable: true })
  approvedBy: User;

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    Fandom.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    const fandomPlain = this;
    const result = await Fandom.elasticsearchService.index({
      index: Entities.FANDOM,
      id: this.id.toString(),
      body: fandomPlain,
    });
    console.log(result);
    if (result.result === 'created' || result.result === 'updated')
      console.log("Elastic search did it's job!");
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    await Fandom.elasticsearchService.delete({
      index: Entities.FANDOM,
      id: this.id.toString(),
    });
  }
}
