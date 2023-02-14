/// <reference types="multer" />
import { ImagesService } from './images.service';
import { StoreImageDto } from './dto/store-image.dto';
import { ImageDto } from './dto/image.dto';
import { ImagesQueryDto } from './dto/images.query.dto';
declare type Response<T extends object> = {
    data: T | [];
};
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    index(query: ImagesQueryDto): Promise<Response<ImageDto[]>>;
    show(id: number): Promise<Response<ImageDto>>;
    store(dto: StoreImageDto, file: Express.Multer.File): Promise<Response<ImageDto>>;
}
export {};
