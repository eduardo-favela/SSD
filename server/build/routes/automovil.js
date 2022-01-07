"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const automovilController_1 = __importDefault(require("../controllers/automovilController"));
class AutomovilRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', automovilController_1.default.getinfo);
    }
}
const automovilRoutes = new AutomovilRoutes();
exports.default = automovilRoutes.router;
