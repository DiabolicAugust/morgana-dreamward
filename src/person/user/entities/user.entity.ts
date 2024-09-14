import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Person } from '../../entity/person.class';
import { Entities } from '../../../data/enums/strings.enum';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EmailVerification } from '../../../email-verify/entities/email-verify.entity';
import { Dream } from '../../../dreams/entities/dream.entity';

@Entity('user')
export class User extends Person {
  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  about: string;

  @OneToOne(
    () => EmailVerification,
    (emailVerification) => emailVerification.user,
    {
      cascade: true,
    },
  )
  @JoinColumn()
  emailVerification: EmailVerification;

  @ManyToMany(() => Dream, (dream) => dream.author, { cascade: true })
  dreams: Dream[];

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    User.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    const userPlain = this;
    const result = await User.elasticsearchService.index({
      index: Entities.USER,
      id: this.id.toString(),
      body: userPlain,
    });
    console.log(result);
    if (result.result === 'created' || result.result === 'updated')
      console.log("Elastic search did it's job!");
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    await User.elasticsearchService.delete({
      index: Entities.USER,
      id: this.id.toString(),
    });
  }
}
