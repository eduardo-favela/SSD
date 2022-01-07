"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const automovilController_1 = __importDefault(require("../controllers/automovilController"));
class AutomovilRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', automovilController_1.default.getinfo);
        this.router.post('/vacio', automovilController_1.default.getinfovacio);
        this.router.post('/full', automovilController_1.default.getinfofull);
        this.router.post('/km', automovilController_1.default.getultimokmengasto);
        this.router.post('/kmrep', automovilController_1.default.getultimokmenreporte);
        this.router.post('/kmnuevo', automovilController_1.default.updatekm);
    }
}
const automovilRoutes = new AutomovilRoutes();
exports.default = automovilRoutes.router;
