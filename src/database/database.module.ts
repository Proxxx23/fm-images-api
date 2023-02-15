import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DatabaseService} from './database.service';
import {Image} from '../images/entity/image';

@Module({
    imports: [TypeOrmModule.forRoot(
        {
            type: 'sqlite',
            database: 'db/images_test.sqlite',
            logging: false,
            synchronize: true, // should not be used in prod env, used to migrate
            entities: [Image],
        },
    )],
    providers: [DatabaseService],
})
export class DatabaseModule {
}
