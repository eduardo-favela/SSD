"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoFaltanteController_1 = __importDefault(require("../controllers/productoFaltanteController"));
class ProductoFaltanteRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', productoFaltanteController_1.default.getProductos);
        this.router.post('/', productoFaltanteController_1.default.registraProductos);
        this.router.post('/getDetalleProductoFaltante', productoFaltanteController_1.default.getDetalleProductoFaltante);
        this.router.post('/getComentariosReporte', productoFaltanteController_1.default.getComentariosReporte);
    }
}
const productofaltanteRoutes = new ProductoFaltanteRoutes();
exports.default = productofaltanteRoutes.router;
