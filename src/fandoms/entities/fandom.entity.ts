import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseParent } from '../../services/base/base.class';
import { User } from '../../person/user/entities/user.entity';

@Entity()
export class Fandom extends BaseParent {
  @Column()
  title: string;

  @Column()
  avatar: string;

  @ManyToOne(() => User)
  author: User;

  @Column({ default: false })
  isApproved: Boolean;

  @ManyToOne(() => User, { nullable: true })
  approvedBy: User;
}
