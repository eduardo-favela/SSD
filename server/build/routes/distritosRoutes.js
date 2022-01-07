"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const centrosCostosController_1 = __importDefault(require("../controllers/centrosCostosController"));
class GastosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', centrosCostosController_1.default.list);
    }
}
const gastosRoutes = new GastosRoutes();
exports.default = gastosRoutes.router;
