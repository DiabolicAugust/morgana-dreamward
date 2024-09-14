import { Module, OnModuleInit } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { User } from '../person/user/entities/user.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [TypeOrmModule.forFeature([Tag, User])],
})
export class TagsModule implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    Tag.setElasticsearchService(this.elasticsearchService);
  }
}
