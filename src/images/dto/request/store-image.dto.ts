import {IsNotEmpty, IsOptional, IsString, Min, Max, MaxLength, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class StoreImageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly title: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(10000)
    readonly width?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(10000)
    readonly height?: number;

    public imageShouldBeResized(): boolean {
        return this.width > 0 && this.height > 0;
    }
}
