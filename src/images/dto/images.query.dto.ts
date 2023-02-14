import {IsNumber, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ImagesQueryDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly title?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly page?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly limit?: number;
}
