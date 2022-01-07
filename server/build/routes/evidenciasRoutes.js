"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evidenciasController_1 = __importDefault(require("../controllers/evidenciasController"));
class EvidenciasRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', evidenciasController_1.default.create);
        this.router.post('/deposito', evidenciasController_1.default.createEvidenciaDepositos);
    }
}
const evidenciasRoutes = new EvidenciasRoutes();
exports.default = evidenciasRoutes.router;
