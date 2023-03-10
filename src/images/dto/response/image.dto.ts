import {ApiProperty} from '@nestjs/swagger';
import {Image} from '../../entity/image';
import {IsNumber, IsString} from 'class-validator';

export class ImageDto {
    @ApiProperty()
    @IsNumber()
    readonly id: number;

    @ApiProperty()
    @IsString()
    readonly url: string;

    @ApiProperty()
    @IsString()
    readonly title: string;

    @ApiProperty()
    @IsNumber()
    readonly width: number | undefined;

    @ApiProperty()
    @IsNumber()
    readonly height: number | undefined;

    @ApiProperty()
    @IsString()
    readonly createdAt: string;

    @ApiProperty()
    @IsString()
    readonly updatedAt: string;

    private constructor(
        id: number,
        url: string,
        title: string,
        width: number | undefined,
        height: number | undefined,
        createdAt: string,
        updatedAt: string) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.width = width;
        this.height = height;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(entity: Image): ImageDto {
        return new this(
            entity.id,
            entity.url,
            entity.title,
            entity.width,
            entity.height,
            entity.createdAt,
            entity.updatedAt,
        );
    }
}
