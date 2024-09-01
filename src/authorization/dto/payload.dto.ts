import { Role } from '../../data/enums/role.enum';

export abstract class Payload {
  id: string;
  username: string;
  email: string;
  role: Role;
}
