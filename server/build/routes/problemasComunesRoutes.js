"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const problemasComunesController_1 = __importDefault(require("../controllers/problemasComunesController"));
class ProblemasComunes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/vending', problemasComunesController_1.default.getproblemasvending);
    }
}
const problemasComunes = new ProblemasComunes();
exports.default = problemasComunes.router;
