import {IsNumber, IsOptional, IsPositive, IsString, Max, Min, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

const MAX_LIMIT = 200;

export class ImagesQueryDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    @ApiProperty()
    readonly title?: string;

    @IsPositive()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty()
    readonly page?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(MAX_LIMIT)
    @Type(() => Number)
    @ApiProperty()
    readonly limit?: number;
}
