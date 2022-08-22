import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config/dist';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
  ],
})
export class AppModule {}
