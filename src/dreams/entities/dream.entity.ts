import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseParent } from '../../services/base/base.class';
import { User } from '../../person/user/entities/user.entity';
import { Fandom } from '../../fandoms/entities/fandom.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Entities } from '../../data/enums/strings.enum';
import { Status } from '../../data/enums/dreams/dream-status.enum';
import { MatureRatring } from '../../data/enums/dreams/dream-mature-rating.enum';

@Entity()
export class Dream extends BaseParent {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  author: User[];

  @Column({ nullable: true })
  cover: string;

  @Column({ type: 'date', nullable: true })
  publicationDate: Date;

  @Column({ type: 'enum', enum: Status, default: Status.UNPUBLISHED })
  status: Status;

  @Column({ type: 'enum', enum: MatureRatring, default: MatureRatring.PG13 })
  matureRating: MatureRatring;

  @Column({ nullable: true })
  bookNumber: number;

  @ManyToOne(() => Fandom)
  fandom: Fandom;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    Dream.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    const dreamPlain = this;
    const result = await Dream.elasticsearchService.index({
      index: Entities.DREAM,
      id: this.id.toString(),
      body: dreamPlain,
    });
    console.log(result);
    if (result.result === 'created' || result.result === 'updated')
      console.log("Elastic search did it's job!");
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    await Dream.elasticsearchService.delete({
      index: Entities.DREAM,
      id: this.id.toString(),
    });
  }
}
