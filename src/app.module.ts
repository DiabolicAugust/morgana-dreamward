import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './typeorm-ds';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './person/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      entities: [process.env.ENTITIES],
      synchronize: false,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
