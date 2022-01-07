"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportesController_1 = __importDefault(require("../controllers/reportesController"));
class ReportesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/registrareporte', reportesController_1.default.registrareporte);
        this.router.post('/enviarEmail', reportesController_1.default.enviarEmail);
        this.router.post('/enviarEmailinterno', reportesController_1.default.enviarEmailinterno);
        this.router.post('/registrahistorial', reportesController_1.default.registrahistorial);
        this.router.post('/getreportefolio', reportesController_1.default.getreportesvendingFolio);
        this.router.post('/getreportesvending', reportesController_1.default.getreportesvending);
        this.router.post('/getdetallereporte', reportesController_1.default.getdetallereporte);
        this.router.get('/getestatus', reportesController_1.default.getestatus);
        this.router.post('/downloadexcel', reportesController_1.default.downloadExcelFile);
        this.router.post('/updatereporte', reportesController_1.default.updatereporte);
    }
}
const reportesRoutes = new ReportesRoutes();
exports.default = reportesRoutes.router;
