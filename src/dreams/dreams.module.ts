import { Module, OnModuleInit } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { DreamsController } from './dreams.controller';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dream } from './entities/dream.entity';
import { User } from '../person/user/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Fandom } from '../fandoms/entities/fandom.entity';
import { UserService } from '../person/user/user.service';
import { Consts } from '../data/strings';

@Module({
  controllers: [DreamsController],
  providers: [
    DreamsService,
    {
      provide: Consts.GET_SERVICE,
      useClass: DreamsService,
    },
    UserService,
  ],
  imports: [TypeOrmModule.forFeature([Dream, User, Tag, Fandom])],
})
export class DreamsModule implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    Dream.setElasticsearchService(this.elasticsearchService);
  }
}
