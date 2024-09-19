import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseParent } from '../../services/base/base.class';
import { User } from '../../person/user/entities/user.entity';
import { Dream } from '../../dreams/entities/dream.entity';

@Entity()
export class Fragment extends BaseParent {
  @Column()
  text: string;

  @ManyToOne(() => Dream)
  relatedDream: Dream;

  @Column({
    nullable: true,
  })
  epigraph: string;

  @Column()
  title: string;

  @ManyToOne(() => User)
  lastModifiedBy: User;

  @Column()
  contentNumber: number;

  @ManyToOne(() => User)
  author: User;
}
