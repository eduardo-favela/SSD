"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
class ArchivosController {
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.files)
            let files = req.files.upload;
            const curDate = moment_1.default().format('DD_MM_YYYY_HH-mm-ss');
            let nombrearchivo = `${curDate}_${files.originalFilename}`;
            //console.log('archivo:',files.originalFilename)
            fs_1.default.rename(files.path, `src/files/${nombrearchivo}`, () => {
                console.log('Renombrado');
            });
            res.json(nombrearchivo);
        });
    }
}
const archivosController = new ArchivosController();
exports.default = archivosController;
