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

    constructor(title: string, width?: number, height?: number) {
        this.title = title; // fixme: needed?
        this.width = width;
        this.height = height;
    }

    // fixme: this causes error in tests as it's not visible on test execution context
    // fixme: results in "TypeError: dto.imageShouldBeResized is not a function" error on test running
    // public imageShouldBeResized(): boolean {
    //     return this.width > 0 && this.height > 0;
    // }
}
