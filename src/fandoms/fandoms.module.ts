import { Module } from '@nestjs/common';
import { FandomsService } from './fandoms.service';
import { FandomsController } from './fandoms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fandom } from './entities/fandom.entity';
import { User } from '../person/user/entities/user.entity';

@Module({
  controllers: [FandomsController],
  providers: [FandomsService],
  imports: [TypeOrmModule.forFeature([Fandom, User])],
})
export class FandomsModule {}
