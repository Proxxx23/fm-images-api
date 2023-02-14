import {IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class StoreImageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly title: string;

    constructor(title: string) {
        this.title = title; // fixme: needed?
    }
}
