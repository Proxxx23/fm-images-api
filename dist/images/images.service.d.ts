/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Image } from './entity/image';
import { ImageDto } from './dto/image.dto';
import { StoreImageDto } from './dto/store-image.dto';
export declare class ImagesService {
    private readonly imagesRepository;
    constructor(imagesRepository: Repository<Image>);
    fetchByTitle(title?: string, page?: number, limit?: number): Promise<ImageDto[]>;
    fetch(id: number): Promise<ImageDto | undefined>;
    store(dto: StoreImageDto, uploadedFile: Express.Multer.File): Promise<ImageDto>;
    private makeUuidFileName;
}
