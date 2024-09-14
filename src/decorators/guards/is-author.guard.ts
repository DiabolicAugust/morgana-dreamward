import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { ParentServiceClass } from '../../data/service-parent.class';
import { Payload } from '../../authorization/dto/payload.dto';
import { Strings } from '../../data/strings';
import { Dream } from '../../dreams/entities/dream.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../person/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../person/user/user.service';
import { Fields } from '../../data/enums/strings.enum';

@Injectable()
export class IsAuthorGuard<T> implements CanActivate {
  constructor(
    @Inject('GetService') private readonly service: ParentServiceClass<T>,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userPayload: Payload = request[Fields.USER];
    const entityId = request.params.id;

    const user = await this.userService.findOne(userPayload.id);
    const entity = await this.service.get(entityId);

    if (!entity) {
      throw new ForbiddenException(Strings.entityNotFound);
    }
    // Check if the entity is an instance of Dream and handle its author array
    if (entity instanceof Dream) {
      if (!entity.author.some((author) => author.id === user.id)) {
        throw new ForbiddenException(Strings.notAuthor);
      }
    } else {
      // Handle the case where the entity has a single author
      if (entity[Fields.AUTHOR].id !== user.id) {
        throw new ForbiddenException(Strings.notAuthor);
      }
    }

    if (entity[Fields.AUTHOR].id == user.id) console.log(Strings.isAuthor);

    return true;
  }
}
