"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registroDepositoController_1 = __importDefault(require("../controllers/registroDepositoController"));
class RegistroDepositoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', registroDepositoController_1.default.registrardeposito);
        this.router.get('/getdeposito', registroDepositoController_1.default.getdeposito);
        this.router.get('/getDepositosId', registroDepositoController_1.default.getDepositosId);
        this.router.post('/getDepositosSinEvidencias', registroDepositoController_1.default.getDepositosSinEvidencias);
        this.router.post('/getDepositosConDiferencia', registroDepositoController_1.default.getDepositosConDiferencia);
        this.router.post('/getDepositosConDiferenciaRegion', registroDepositoController_1.default.getDepositosConDiferenciaRegion);
        this.router.post('/registrarcomplemento', registroDepositoController_1.default.registraComplemetoDeposito);
        this.router.post('/getDiferenciaDeposito', registroDepositoController_1.default.getDiferenciaDeposito);
        this.router.post('/getComplemetosDeposito', registroDepositoController_1.default.getComplemetosDeposito);
        this.router.get('/getReferencias', registroDepositoController_1.default.getReferencias);
    }
}
const registroDepositoRoutes = new RegistroDepositoRoutes();
exports.default = registroDepositoRoutes.router;
