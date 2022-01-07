"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archivosController_1 = __importDefault(require("../controllers/archivosController"));
const multipart = require('connect-multiparty');
const multiPartMiddleware = multipart({
    uploadDir: './src/files'
});
class ArchivosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // this.router.post('/', multiPartMiddleware, (req, res, next)=>{
        //     console.log(req.files)
        // })
        this.router.post('/', multiPartMiddleware, archivosController_1.default.upload);
    }
}
const archivosRoutes = new ArchivosRoutes();
exports.default = archivosRoutes.router;
