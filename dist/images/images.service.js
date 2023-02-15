"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const image_1 = require("./entity/image");
const image_dto_1 = require("./dto/image.dto");
const sharp_1 = __importDefault(require("sharp"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const DEFAULT_IMAGES_FETCH_LIMIT = 100;
const todayDate = (0, date_fns_1.formatISO9075)(new Date(), { representation: 'date' });
const STORAGE_IMG_DIR_PATH = 'storage/images';
const STORAGE_ABS_IMG_DIR_PATH = `${__dirname}/../../${STORAGE_IMG_DIR_PATH}/${todayDate}`;
let ImagesService = class ImagesService {
    constructor(imagesRepository) {
        this.imagesRepository = imagesRepository;
    }
    async fetchByTitle(title, page = 0, limit = DEFAULT_IMAGES_FETCH_LIMIT) {
        let whereTitleLikeClause;
        if (title) {
            whereTitleLikeClause = {
                where: {
                    title: (0, typeorm_1.Like)(`%${title}%`),
                },
            };
        }
        const entities = await this.imagesRepository.find({
            ...whereTitleLikeClause,
            skip: page,
            take: limit,
        });
        return entities.map(entity => image_dto_1.ImageDto.fromEntity(entity));
    }
    async fetch(id) {
        const entity = await this.imagesRepository.findOneBy({ id });
        return entity
            ? image_dto_1.ImageDto.fromEntity(entity)
            : undefined;
    }
    async store(dto, uploadedFile) {
        await fs_extra_1.default.ensureDir(STORAGE_ABS_IMG_DIR_PATH);
        const fileName = this.makeUuidFileName(uploadedFile);
        const imageSavePath = `${STORAGE_ABS_IMG_DIR_PATH}/${fileName}`;
        const processedImage = await (0, sharp_1.default)(uploadedFile.buffer);
        if (dto.imageShouldBeResized()) {
            await processedImage.resize(dto.width, dto.height);
        }
        const metadata = await processedImage.toFile(imageSavePath);
        const entity = await this.imagesRepository.save(this.imagesRepository.create({
            url: `${STORAGE_IMG_DIR_PATH}/${fileName}`,
            title: dto.title,
            width: metadata.width,
            height: metadata.height,
        }));
        return image_dto_1.ImageDto.fromEntity(entity);
    }
    makeUuidFileName(file) {
        return `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
    }
};
ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(image_1.Image)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ImagesService);
exports.ImagesService = ImagesService;
//# sourceMappingURL=images.service.js.map