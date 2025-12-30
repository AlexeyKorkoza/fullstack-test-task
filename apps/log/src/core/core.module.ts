import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { type Connection } from 'mongoose';

import configuration from '@/configuration';
import { type AppConfig } from '@/core/interfaces';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        uri: configService.get<string>('mongodbUri'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => Logger.log('MongoDB is connected'));
          connection.on('open', () => Logger.log('MongoDB is open'));
          connection.on('disconnected', () =>
            Logger.log('MongoDB is disconnected'),
          );
          connection.on('reconnected', () =>
            Logger.log('MongoDB is reconnected'),
          );
          connection.on('disconnecting', () =>
            Logger.log('MongoDB is disconnecting'),
          );

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
