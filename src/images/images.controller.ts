import {
    BadRequestException,
    Body,
    Controller, FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    MaxFileSizeValidator, NotFoundException,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {ImagesService} from './images.service';
import {ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {StoreImageDto} from './dto/request/store-image.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {ImageDto} from './dto/response/image.dto';
import {ImagesQueryDto} from './dto/request/images.query.dto';
import {ApiImplicitFile} from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';

const MAX_IMAGE_SIZE_KB = 5096 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = 'jpeg|jpg|gif|bmp|tiff|png|webp';

type Response<T extends object> = {
    data: T | [],
};

@ApiTags('pictures')
@Controller('/images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Get('/')
    @ApiOperation({ summary: 'Fetch all the images' })
    @ApiOkResponse({
        isArray: true,
        type: ImageDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid filtering data provided (e.g. negative page)' })
    @HttpCode(HttpStatus.OK)
    async index(@Query() query: ImagesQueryDto): Promise<Response<ImageDto[]>> {
        return {
            data: await this.imagesService.fetchByTitle(query.title, query.page, query.limit),
        };
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Fetch image by the id' })
    @ApiOkResponse({ type: ImageDto })
    @ApiBadRequestResponse({ description: 'Invalid id format/type passed.' })
    @ApiNotFoundResponse({ description: 'Image with given ID could not be found.' })
    @HttpCode(HttpStatus.OK)
    async show(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
        id: number,
    ): Promise<Response<ImageDto>> {
        const image = await this.imagesService.fetch(id);
        if (!(image instanceof ImageDto)) {
            throw new NotFoundException('Could not find image with given id.');
        }

        return {
            data: image,
        };
    }

    @Post('/')
    @ApiOperation({ summary: 'Upload and store image data' })
    @ApiImplicitFile({ name: 'image', required: true, description: 'Uploaded image' })
    @ApiOkResponse({ type: ImageDto })
    @ApiInternalServerErrorResponse({ description: 'Could not store image either in DB or on local disk.' })
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image'))
    async store(
        @Body() dto: StoreImageDto,
        @UploadedFile(new ParseFilePipe(
            {
                validators: [
                    new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_KB }),
                    new FileTypeValidator({ fileType: new RegExp(ALLOWED_IMAGE_EXTENSIONS) }),
                ],
            },
        )) file: Express.Multer.File,
    ): Promise<Response<ImageDto>> {
        return {
            data: await this.imagesService.store(dto, file),
        };
    }
}
