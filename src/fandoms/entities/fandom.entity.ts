import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseParent } from '../../services/base/base.class';
import { User } from '../../person/user/entities/user.entity';

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
}
