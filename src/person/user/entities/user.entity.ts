import { Column, Entity } from 'typeorm';
import { Person } from '../../entity/person.class';

@Entity('user')
export class User extends Person {
  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  about: string;
}
