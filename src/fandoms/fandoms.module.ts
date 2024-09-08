import { Module } from '@nestjs/common';
import { FandomsService } from './fandoms.service';
import { FandomsController } from './fandoms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fandom } from './entities/fandom.entity';
import { User } from '../person/user/entities/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [FandomsController],
  providers: [FandomsService],
  imports: [
    TypeOrmModule.forFeature([Fandom, User]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.FILES_ROOT),
      serveRoot: process.env.FILES_API_ROOT,
    }),
  ],
})
export class FandomsModule {}
