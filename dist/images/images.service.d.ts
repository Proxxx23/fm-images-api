/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Image } from './entity/image';
import { ImageDto } from './dto/image.dto';
declare type StoreImage = {
    title: string;
};
export declare class ImagesService {
    private readonly imagesRepository;
    constructor(imagesRepository: Repository<Image>);
    fetchByTitle(title: string, page?: number, limit?: number): Promise<ImageDto[]>;
    fetch(id: number): Promise<ImageDto | []>;
    store({ title }: StoreImage, file: Express.Multer.File): Promise<ImageDto>;
}
export {};
