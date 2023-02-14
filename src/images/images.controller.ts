import {
    Body,
    Controller, FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {ImagesService} from './images.service';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {StoreImageDto} from './dto/store-image.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {ImageDto} from './dto/image.dto';
import {ImagesQueryDto} from './dto/images.query.dto';
import {ApiImplicitFile} from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';

const MAX_IMAGE_SIZE_KB = 5096;

type Response<T extends object> = {
    data: T | [],
};

@ApiTags('pictures')
@Controller('/images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Get('/')
    @ApiOperation({ summary: 'Fetch all the images' })
    @ApiOkResponse(
        {
            isArray: true,
            type: ImageDto,
        },
    )
    @ApiBadRequestResponse({
        description: 'Title should be a string with more than 1 character.',
    })
    @HttpCode(HttpStatus.OK)
    async index(@Query() query: ImagesQueryDto): Promise<Response<ImageDto[]>> {
        return {
            data: await this.imagesService.fetchByTitle(query.title, query.page, query.limit),
        };
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Fetch image by the id' })
    @ApiOkResponse(
        {
            type: ImageDto,
        },
    )
    @ApiBadRequestResponse({
        description: 'Invalid id format/type passed.',
    })
    @HttpCode(HttpStatus.OK)
    async show(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
        id: number,
    ): Promise<Response<ImageDto>> {
        return {
            data: await this.imagesService.fetch(id),
        };
    }

    @Post('/')
    @ApiOperation({ summary: 'Upload and store image data' })
    @ApiImplicitFile({ name: 'image', required: true, description: 'Uploaded image' })
    @ApiOkResponse(
        {
            type: ImageDto,
        },
    )
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image'))
    async store(
        @Body() dto: StoreImageDto,
        @UploadedFile(new ParseFilePipe(
            {
                validators: [
                    new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_KB }),
                    new FileTypeValidator({ fileType: new RegExp('jpeg|jpg|gif|bmp|tiff|png') }),
                ],
            },
        )) file: Express.Multer.File,
    ): Promise<Response<ImageDto>> {
        let entity;
        try {
            entity = await this.imagesService.store(dto, file); // todo: check if throws 500
        } catch (e) {
            throw new InternalServerErrorException('Internal Server Error.');
        }

        return {
            data: entity,
        };
    }
}
