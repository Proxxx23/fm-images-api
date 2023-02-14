import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Image} from './entity/image';
import {ImageDto} from './dto/image.dto';

const DEFAULT_LIMIT = 100;

type StoreImage = {
    title: string,
};

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private readonly imagesRepository: Repository<Image>) {
    }

    async fetchByTitle(title: string, page = 1, limit = DEFAULT_LIMIT): Promise<ImageDto[]> {
        const entities = await this.imagesRepository.find({
            where: {
                title,
            },
            skip: page,
            take: limit,
        });

        return entities.length > 0
            ? entities.map(entity => ImageDto.fromEntity(entity))
            : [];
    }

    async fetch(id: number): Promise<ImageDto | []> {
        const entity = await this.imagesRepository.findOneBy({ id });

        return entity
            ? ImageDto.fromEntity(entity)
            : []; // fixme
    }

    // returns entity
    async store({ title }: StoreImage, file: Express.Multer.File): Promise<ImageDto> {
        // store to local

        const url = '';
        const width = 50;
        const height = 100;

        const entity = await this.imagesRepository.save(
            this.imagesRepository.create({
                url,
                title,
                width,
                height,
            }),
        );

        return ImageDto.fromEntity(entity);

        // todo: should we remove uploaded file from local if DB failed to save?
    }
}
