"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const centrosCostosController_1 = __importDefault(require("../controllers/centrosCostosController"));
class CentrosCostosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/todos', centrosCostosController_1.default.todos);
        this.router.get('/todosvending', centrosCostosController_1.default.todosvending);
        this.router.get('/tiposmaqpv', centrosCostosController_1.default.maquinasenpv);
        this.router.get('/getsucursales', centrosCostosController_1.default.getsucursales);
    }
}
const centrosCostosRoutes = new CentrosCostosRoutes();
exports.default = centrosCostosRoutes.router;
