import { Module } from '@nestjs/common';
import { FragmentsService } from './fragments.service';
import { FragmentsController } from './fragments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fragment } from './entities/fragment.entity';
import { User } from '../person/user/entities/user.entity';
import { Dream } from '../dreams/entities/dream.entity';
import { DreamsService } from '../dreams/dreams.service';
import { Consts } from '../data/strings';
import { Tag } from '../tags/entities/tag.entity';
import { Fandom } from '../fandoms/entities/fandom.entity';
import { UserService } from '../person/user/user.service';

@Module({
  controllers: [FragmentsController],
  providers: [
    FragmentsService,
    DreamsService,
    UserService,
    {
      provide: Consts.GET_SERVICE,
      useClass: DreamsService,
    },
  ],
  imports: [TypeOrmModule.forFeature([Fragment, User, Dream, Tag, Fandom])],
})
export class FragmentsModule {}
