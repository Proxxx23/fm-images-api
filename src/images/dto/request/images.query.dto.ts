import {IsNumber, IsOptional, IsPositive, IsString, Max, Min, MinLength} from 'class-validator';
import {ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';

const MAX_LIMIT = 200;

export class ImagesQueryDto {
    @IsString()
    @MinLength(4)
    @IsOptional()
    @ApiPropertyOptional()
    readonly title?: string;

    @IsPositive()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiPropertyOptional()
    readonly page?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(MAX_LIMIT)
    @Type(() => Number)
    @ApiPropertyOptional()
    readonly limit?: number;
}