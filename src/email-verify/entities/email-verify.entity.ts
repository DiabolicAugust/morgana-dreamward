import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../../person/user/entities/user.entity';
import { BaseParent } from '../../services/base/base.class';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class EmailVerification extends BaseParent {
  @OneToOne(() => User, (user) => user.emailVerification)
  @Exclude({ toPlainOnly: true })
  user: User;

  @Column()
  email: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude({ toPlainOnly: true })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
