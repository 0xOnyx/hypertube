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
exports.StreamingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const streaming_service_1 = require("./streaming.service");
let StreamingController = class StreamingController {
    constructor(streamingService) {
        this.streamingService = streamingService;
    }
    async streamMovie(id, res) {
        return this.streamingService.streamMovie(id, res);
    }
};
exports.StreamingController = StreamingController;
__decorate([
    (0, common_1.Get)('movies/:id/stream'),
    (0, swagger_1.ApiOperation)({ summary: 'Stream a movie' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StreamingController.prototype, "streamMovie", null);
exports.StreamingController = StreamingController = __decorate([
    (0, swagger_1.ApiTags)('streaming'),
    (0, common_1.Controller)('streaming'),
    __metadata("design:paramtypes", [streaming_service_1.StreamingService])
], StreamingController);
//# sourceMappingURL=streaming.controller.js.map