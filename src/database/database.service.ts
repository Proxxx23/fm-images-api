import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {InjectDataSource} from '@nestjs/typeorm';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectDataSource()
        private readonly db: DataSource) {
    }

    cleanTestingDatabase(): void {
        this.db.initialize()
            .then((db) => db.query('TRUNCATE TABLE images_test'))
            .catch((err) => console.log(err));
    }
}
