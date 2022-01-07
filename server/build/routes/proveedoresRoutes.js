"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedoresController_1 = __importDefault(require("../controllers/proveedoresController"));
class ProveedoresRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', proveedoresController_1.default.getOne);
    }
}
const proveedoresRoutes = new ProveedoresRoutes();
exports.default = proveedoresRoutes.router;
