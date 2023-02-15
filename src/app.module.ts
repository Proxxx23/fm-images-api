import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './images/entity/image';
import { ImagesModule } from './images/images.module';
import * as process from 'process';

@Module({
    imports: [
        ImagesModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: process.env.NODE_ENV === 'production'
                ? 'db/images.sqlite'
                : 'db/images_test.sqlite',
            logging: false,
            synchronize: true, // should not be used in prod env, used to migrate
            entities: [Image],
        }),
    ],
})

export class AppModule {}
