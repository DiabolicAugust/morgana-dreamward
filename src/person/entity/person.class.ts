import { Exclude } from 'class-transformer';
import { BaseParent } from '../../services/base/base.class';
import { Column } from 'typeorm';
import { Role } from '../../data/enums/role.enum';

export class Person extends BaseParent {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
