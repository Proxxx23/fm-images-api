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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const image_1 = require("./entity/image");
const image_dto_1 = require("./dto/image.dto");
const DEFAULT_LIMIT = 100;
let ImagesService = class ImagesService {
    constructor(imagesRepository) {
        this.imagesRepository = imagesRepository;
    }
    async fetchByTitle(title, page = 1, limit = DEFAULT_LIMIT) {
        const entities = await this.imagesRepository.find({
            where: {
                title,
            },
            skip: page,
            take: limit,
        });
        return entities.length > 0
            ? entities.map(entity => image_dto_1.ImageDto.fromEntity(entity))
            : [];
    }
    async fetch(id) {
        const entity = await this.imagesRepository.findOneBy({ id });
        return entity
            ? image_dto_1.ImageDto.fromEntity(entity)
            : [];
    }
    async store({ title }, file) {
        const url = '';
        const width = 50;
        const height = 100;
        const entity = await this.imagesRepository.save(this.imagesRepository.create({
            url,
            title,
            width,
            height,
        }));
        return image_dto_1.ImageDto.fromEntity(entity);
    }
};
ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(image_1.Image)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ImagesService);
exports.ImagesService = ImagesService;
//# sourceMappingURL=images.service.js.map