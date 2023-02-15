import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {ImagesModule} from './images.module';
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {Image} from './entity/image';
import {Repository} from 'typeorm';
import {ImageDto} from './dto/image.dto';

describe('AppController', () => {
    let app: INestApplication;

    let repository: Repository<Image>;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ImagesModule,
                TypeOrmModule.forRoot(
                    {
                        type: 'sqlite',
                        database: 'db/images_test.sqlite',
                        logging: false,
                        synchronize: true, // should not be used in prod env, used to migrate
                        entities: [Image],
                    },
                ),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        repository = module.get(getRepositoryToken(Image));
        await repository.clear();
    });

    afterEach(async () => {
        await repository.clear();
    });

    describe('[GET] all images', () => {
        it('responds with an empty array if there are no images in database', () => {
            return request(app.getHttpServer())
                .get('/images')
                .expect(HttpStatus.OK)
                .expect({
                    data: [],
                });
        });

        it('responds 400 BAD RESPONSE on title query param provided but it is an empty string', () => {
            return request(app.getHttpServer())
                .get('/images')
                .query({ title: '' })
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('responds 400 BAD RESPONSE on page is negative number', () => {
            return request(app.getHttpServer())
                .get('/images')
                .query({ page: -1 })
                .expect(HttpStatus.BAD_REQUEST);
        });

        it.each([0, -1])('responds 400 BAD RESPONSE on limit is zero or negative number', (number) => {
            return request(app.getHttpServer())
                .get('/images')
                .query({ limit: number })
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('responds with an array of images properly', () => {
            const firstImage = {
                url: 'anyurl',
                title: 'Test title',
                width: 800,
                height: 600,
            };

            const secondImage = {
                url: 'anyurl2',
                title: 'Test title 2',
                width: 1024,
                height: 768,
            };

            repository.save(repository.create(firstImage));
            repository.save(repository.create(secondImage));

            return request(app.getHttpServer())
                .get('/images')
                .expect(HttpStatus.OK)
                .expect({
                    data: [
                        firstImage,
                        secondImage,
                    ],
                });
        });

        it('responds with an array of images properly filtered by an existing title query param', () => {
            const steinsImage = {
                url: 'steins/url',
                title: 'Steins Gate wallpaper',
                width: 800,
                height: 600,
            };

            const idInvadedImage = {
                url: 'invaded/url',
                title: 'IdInvaded wallpaper',
                width: 1024,
                height: 768,
            };

            repository.save(repository.create(steinsImage));
            repository.save(repository.create(idInvadedImage));

            return request(app.getHttpServer())
                .get('/images')
                .query({ title: 'Steins' })
                .expect(HttpStatus.OK)
                .expect({
                    data: [
                        steinsImage,
                    ],
                });
        });

        it('responds with an empty array if filtered by a non existing title', () => {
            const steinsImage = {
                url: 'steins/url',
                title: 'Steins Gate wallpaper',
                width: 800,
                height: 600,
            };

            const idInvadedImage = {
                url: 'invaded/url',
                title: 'IdInvaded wallpaper',
                width: 1024,
                height: 768,
            };

            repository.save(repository.create(steinsImage));
            repository.save(repository.create(idInvadedImage));

            return request(app.getHttpServer())
                .get('/images')
                .query({ title: 'NONEXISTINGTITLE' })
                .expect(HttpStatus.OK)
                .expect({
                    data: [], // HERE
                });
        });
    });

    describe('[GET]/:id', () => {
        it('responds with 404 NOT_FOUND if image with given id does not exist', () => {
            return request(app.getHttpServer())
                .get('/images/1991453')
                .expect(HttpStatus.NOT_FOUND);
        });

        it('responds with an image data if image with given id exists', async () => {
            const image = {
                url: 'test/url',
                title: 'Test image',
                width: 800,
                height: 600,
            };

            const savedEntity = await repository.save(repository.create(image));

            return request(app.getHttpServer())
                .get('/images/' + savedEntity.id)
                .expect(HttpStatus.OK)
                .expect({ // fixme
                    data: {
                        id: savedEntity.id,
                        ...savedEntity,
                    },
                });
        });
    });

    // describe('[POST]/', () => {
    //     it('returns empty array on no images in database', () => {
    //
    //         expect(appController.getHello()).toBe('Hello World!');
    //     });
    // });
});
