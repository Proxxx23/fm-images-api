import {IsNumber, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

export class ImagesQueryDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly title?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty()
    readonly page?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty()
    readonly limit?: number;
}
