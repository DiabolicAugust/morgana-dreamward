import { Exclude } from 'class-transformer';
import { BaseParent } from '../../services/base/base.class';
import { Column } from 'typeorm';
import { Role } from '../../services/enums/role.enum';

export class Person extends BaseParent {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  avatar: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
