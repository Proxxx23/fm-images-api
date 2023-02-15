"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const images_service_1 = require("./images.service");
const swagger_1 = require("@nestjs/swagger");
const store_image_dto_1 = require("./dto/store-image.dto");
const platform_express_1 = require("@nestjs/platform-express");
const image_dto_1 = require("./dto/image.dto");
const images_query_dto_1 = require("./dto/images.query.dto");
const api_implicit_file_decorator_1 = require("@nestjs/swagger/dist/decorators/api-implicit-file.decorator");
const MAX_IMAGE_SIZE_KB = 5096 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = 'jpeg|jpg|gif|bmp|tiff|png|webp';
let ImagesController = class ImagesController {
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    async index(query) {
        return {
            data: await this.imagesService.fetchByTitle(query.title, query.page, query.limit),
        };
    }
    async show(id) {
        const image = await this.imagesService.fetch(id);
        if (!image) {
            throw new common_1.NotFoundException('Could not find image with given id.');
        }
        return {
            data: image,
        };
    }
    async store(dto, file) {
        return {
            data: await this.imagesService.store(dto, file),
        };
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all the images' }),
    (0, swagger_1.ApiOkResponse)({
        isArray: true,
        type: image_dto_1.ImageDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Title should be a string with more than 1 character.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [images_query_dto_1.ImagesQueryDto]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "index", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch image by the id' }),
    (0, swagger_1.ApiOkResponse)({ type: image_dto_1.ImageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id format/type passed.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Image with given ID could not be found.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.BAD_REQUEST }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "show", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload and store image data' }),
    (0, api_implicit_file_decorator_1.ApiImplicitFile)({ name: 'image', required: true, description: 'Uploaded image' }),
    (0, swagger_1.ApiOkResponse)({ type: image_dto_1.ImageDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_KB }),
            new common_1.FileTypeValidator({ fileType: new RegExp(ALLOWED_IMAGE_EXTENSIONS) }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_image_dto_1.StoreImageDto, Object]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "store", null);
ImagesController = __decorate([
    (0, swagger_1.ApiTags)('pictures'),
    (0, common_1.Controller)('/images'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
exports.ImagesController = ImagesController;
//# sourceMappingURL=images.controller.js.map