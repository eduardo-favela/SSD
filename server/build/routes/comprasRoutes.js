"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comprasController_1 = __importDefault(require("../controllers/comprasController"));
class ComprasRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getalmacenes', comprasController_1.default.getalmacenes);
        this.router.get('/getproducts', comprasController_1.default.getproducts);
        this.router.post('/getproductosDI', comprasController_1.default.getproductosDI);
        this.router.post('/getinventario', comprasController_1.default.getinventario);
        this.router.post('/getinventarioant', comprasController_1.default.getinventarioant);
        this.router.post('/setinvent', comprasController_1.default.setinvent);
        this.router.post('/setinventdet', comprasController_1.default.setinventdet);
        this.router.post('/updateinvent', comprasController_1.default.updateinvent);
    }
}
const comprasRoutes = new ComprasRoutes();
exports.default = comprasRoutes.router;
