import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const sslMode =
      nodeEnv === 'production' ? { rejectUnauthorized: false } : false;
    return {
      type: configService.get('DB_TYPE'),
      host: configService.get('DB_HOST'),
      port: parseInt(configService.get('DB_PORT'), 10),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      autoLoadEntities: true,
      synchronize: true,
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      logging: true,
      ssl: sslMode,
    } as DataSourceOptions;
  },
};
