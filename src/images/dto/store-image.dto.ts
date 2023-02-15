import {IsNotEmpty, IsOptional, IsString, Min, Max, MaxLength, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {Optional} from '@nestjs/common';

export class StoreImageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly title: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(10000)
    readonly width?: number;

    @ApiProperty()
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

    public imageShouldBeResized(): boolean {
        return this.width > 0 && this.height > 0;
    }
}
