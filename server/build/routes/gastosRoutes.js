"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gastosController_1 = __importDefault(require("../controllers/gastosController"));
class GastosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', gastosController_1.default.create);
        this.router.post('/updatefoliogasto', gastosController_1.default.updategasto);
        this.router.post('/registrarcc', gastosController_1.default.registrarcc);
        this.router.get('/foliosFactura', gastosController_1.default.getFoliosFactura);
        this.router.get('/checkFolioGasto', gastosController_1.default.checkFolioGasto);
        this.router.post('/getGastosSinEvidencia', gastosController_1.default.getGastosSinEvidencia);
    }
}
const gastosRoutes = new GastosRoutes();
exports.default = gastosRoutes.router;
