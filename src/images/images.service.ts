import {Injectable} from '@nestjs/common';
import {Like, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Image} from './entity/image';
import {ImageDto} from './dto/image.dto';
import {StoreImageDto} from './dto/store-image.dto';
import sharp from 'sharp';
import fse from 'fs-extra';
import {formatISO9075} from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const DEFAULT_IMAGES_FETCH_LIMIT = 100;

const todayDate = formatISO9075(new Date(), { representation: 'date' });
const STORAGE_IMG_DIR_PATH = 'storage/images'; // todo: env?
const STORAGE_ABS_IMG_DIR_PATH = `${__dirname}/../../${STORAGE_IMG_DIR_PATH}/${todayDate}`;

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private readonly imagesRepository: Repository<Image>) {
    }

    async fetchByTitle(title?: string, page = 0, limit = DEFAULT_IMAGES_FETCH_LIMIT): Promise<ImageDto[]> {
        let whereTitleLikeClause;
        if (title) {
            whereTitleLikeClause = {
                where: {
                    title: Like(`%${title}%`),
                },
            };
        }

        const entities = await this.imagesRepository.find({
            ...whereTitleLikeClause,
            skip: page,
            take: limit,
        });

        return entities.map(entity => ImageDto.fromEntity(entity));
    }

    async fetch(id: number): Promise<ImageDto | undefined> {
        const entity = await this.imagesRepository.findOneBy({ id });

        return entity
            ? ImageDto.fromEntity(entity)
            : undefined;
    }

    async store(dto: StoreImageDto, uploadedFile: Express.Multer.File): Promise<ImageDto> {
        await fse.ensureDir(STORAGE_ABS_IMG_DIR_PATH);

        const fileName = this.makeUuidFileName(uploadedFile);
        const imageSavePath = `${STORAGE_ABS_IMG_DIR_PATH}/${fileName}`;

        const processedImage = await sharp(uploadedFile.buffer);
        if (dto.imageShouldBeResized()) {
            await processedImage.resize(dto.width, dto.height);
        }

        const metadata = await processedImage.toFile(imageSavePath);

        const entity = await this.imagesRepository.save(
            this.imagesRepository.create({
                url: `${STORAGE_IMG_DIR_PATH}/${fileName}`,
                title: dto.title,
                width: metadata.width,
                height: metadata.height,
            }),
        );

        return ImageDto.fromEntity(entity);
    }

    private makeUuidFileName(file: Express.Multer.File): string {
        return `${uuidv4()}${path.extname(file.originalname)}`;
    }
}
