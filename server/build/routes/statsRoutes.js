"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = __importDefault(require("../controllers/statsController"));
class StatsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/getVentasPV', statsController_1.default.getVentasPV);
        this.router.post('/getPresupuestosArticuloPV', statsController_1.default.getPresupuestosArticuloPV);
        this.router.get('/stats', statsController_1.default.getStatsFile);
        this.router.get('/ventadiaria', statsController_1.default.getVentaDiaria);
        this.router.get('/ventasemanal', statsController_1.default.getVentaSemanal);
        this.router.get('/ventadiaproddb', statsController_1.default.getVentasProdDiaBD);
        this.router.get('/ventadiaprodex', statsController_1.default.getVentasProdEX);
        this.router.post('/setVentasProdBD', statsController_1.default.setVentasProdBD);
        this.router.post('/ventadiariaproddbpv', statsController_1.default.getVentasProdDiaBDPV);
        this.router.post('/ventadiariaproddb', statsController_1.default.getVentasProdBD);
    }
}
const statsRoutes = new StatsRoutes();
exports.default = statsRoutes.router;
