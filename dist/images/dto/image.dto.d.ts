import { Image } from '../entity/image';
export declare class ImageDto {
    readonly id: number;
    readonly url: string;
    readonly title: string;
    readonly width?: number;
    readonly height?: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    private constructor();
    static fromEntity(entity: Image): ImageDto;
}
