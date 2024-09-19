import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './person/user/user.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ElasticsearchProviderModule } from './elastic/elastic.module';
import { MulterModuleProvider } from './services/multer-config.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailVerifyModule } from './email-verify/email-verify.module';
import { DreamsModule } from './dreams/dreams.module';
import { FandomsModule } from './fandoms/fandoms.module';
import { TagsModule } from './tags/tags.module';
import { FragmentsModule } from './fragments/fragments.module';

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
    MulterModuleProvider,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.FILES_ROOT),
      serveRoot: process.env.FILES_API_ROOT,
    }),
    ElasticsearchProviderModule,
    UserModule,
    AuthorizationModule,
    EmailVerifyModule,
    DreamsModule,
    FandomsModule,
    TagsModule,
    FragmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
