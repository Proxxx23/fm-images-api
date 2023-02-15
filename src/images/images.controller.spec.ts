import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {ImagesModule} from './images.module';
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {Image} from './entity/image';
import {Repository} from 'typeorm';
import * as fs from 'fs/promises';
import sharp from 'sharp';

const assertFileExists = async (filepath: string) => {
    try {
        await fs.access(filepath);
    } catch (e) {
        throw Error('File was not stored.');
    }
};

describe('AppController', () => {
    let app: INestApplication;

    let repository: Repository<Image>;
    beforeAll(async () => {
        // todo: this should be stored as separate DB cleaner service dependant on ENV
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

    describe('[POST]/', () => {
        it('responds with 400 BAD REQUEST if file title is an empty string', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field('title', '')
                .attach('image', Buffer.alloc(1024 * 1024), 'dummy.jpeg')
                .expect((res) => expect(res.body.message).toBe('title should not be empty'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('responds with 400 BAD REQUEST if file size exceeds limit', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Any title')
                .attach('image', Buffer.alloc(1024 * 8000), 'dummy.jpeg')
                .expect((res) => expect(res.body.message).toBe('Validation failed (expected size is less than 5218304)'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('responds with 400 BAD REQUEST if file extension is invalid', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Any title')
                .attach('image', Buffer.alloc(1024), 'dummy.weirdextension')
                .expect((res) => expect(res.body.message).toBe('Validation failed (expected type is /jpeg|jpg|gif|bmp|tiff|png|webp/)'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it.skip('responds with 400 BAD REQUEST if width is zero', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field({
                    title: 'Any title',
                    width: 0,
                })
                .attach('image', `${__dirname}/../../fixtures/test_file_upload.jpg`)
                .expect((res) => expect(res.body.message).toBe('width must not be less than 1'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it.skip('responds with 400 BAD REQUEST if width is greater than 10000', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Any title')
                .field('width', 9999999)
                .attach('image', `${__dirname}/../../fixtures/test_file_upload.jpg`)
                .expect((res) => expect(res.body.message).toBe('width must not be greater than 10000'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it.skip('responds with 400 BAD REQUEST if height is zero', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Any title')
                .field('height', 0)
                .attach('image', `${__dirname}/../../fixtures/test_file_upload.jpg`)
                .expect((res) => expect(res.body.message).toBe('height must not be less than 1'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it.skip('responds with 400 BAD REQUEST if height is greater than 10000', () => {
            return request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field({
                    title: 'Any title',
                    height: 999999,
                })
                .attach('image', `${__dirname}/../../fixtures/test_file_upload.jpg`)
                .expect((res) => expect(res.body.message).toBe('height must not be greater than 10000'))
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('stores image data and responds with data', async () => {
            const resp = await request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field('title', 'Any title')
                .attach('image', `${__dirname}/../../fixtures/test_file_upload.jpg`)
                .expect((res) => {
                    expect(res.body.data).not.toBe({});
                    expect(res.body.data.width).toBe(1920);
                    expect(res.body.data.height).toBe(1200);
                })
                .expect(HttpStatus.CREATED);

            const filepath = `${__dirname}/../../${resp.body.data.url}`;
            await assertFileExists(filepath);

            await fs.unlink(filepath);

            return resp;
        });

        it('stores image data, resizes image and responds with data', async () => {
            const resp = await request(app.getHttpServer())
                .post('/images')
                .set('Content-Type', 'multipart/form-data')
                .field({
                    title: 'Any title',
                    width: 800,
                    height: 600,
                })
                .attach('image', `${__dirname}/../../fixtures/test_file_upload.jpg`)
                .expect((res) => {
                    expect(res.body.data).not.toBe({});
                    expect(res.body.data.width).toBe(800);
                    expect(res.body.data.height).toBe(600);
                })
                .expect(HttpStatus.CREATED);

            const filepath = `${__dirname}/../../${resp.body.data.url}`;

            await assertFileExists(filepath);

            const { width, height } = await sharp(filepath).metadata();
            expect(width).toBe(resp.body.data.width);
            expect(height).toBe(resp.body.data.height);

            await fs.unlink(filepath);

            return resp;
        });
    });
});
