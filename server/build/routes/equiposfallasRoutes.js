"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equiposFallasController_1 = __importDefault(require("../controllers/equiposFallasController"));
class EquiposfallasRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', equiposFallasController_1.default.getEquipos);
        this.router.get('/getEstatusReporte', equiposFallasController_1.default.getEstatusReporte);
        this.router.post('/getReportesDistrito', equiposFallasController_1.default.getReportesDistrito);
        this.router.post('/fallas', equiposFallasController_1.default.getFallas);
        this.router.post('/registraReporte', equiposFallasController_1.default.registraReporte);
        this.router.post('/registraEquipo', equiposFallasController_1.default.registraEquipo);
        this.router.post('/updateEstatusRep', equiposFallasController_1.default.updateEstatusRep);
        this.router.post('/registraComentarios', equiposFallasController_1.default.registraComentarios);
        this.router.post('/getDetalleReporte', equiposFallasController_1.default.getDetalleReporte);
    }
}
const equiposfallasRoutes = new EquiposfallasRoutes();
exports.default = equiposfallasRoutes.router;
