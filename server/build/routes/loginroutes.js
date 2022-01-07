"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = __importDefault(require("../controllers/loginController"));
class ReportesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/iniciarsesion', loginController_1.default.login);
        this.router.post('/setUser', loginController_1.default.setUser);
        this.router.post('/updateUser', loginController_1.default.updateUser);
    }
}
const reportesRoutes = new ReportesRoutes();
exports.default = reportesRoutes.router;
