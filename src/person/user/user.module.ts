import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    // Установка ElasticsearchService в классе User
    User.setElasticsearchService(this.elasticsearchService);
  }
}
