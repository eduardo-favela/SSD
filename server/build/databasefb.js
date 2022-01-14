"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_firebird_1 = __importDefault(require("node-firebird"));
const keysfirebird_1 = __importDefault(require("./keysfirebird"));
const pool = node_firebird_1.default.pool(25, keysfirebird_1.default);
exports.default = pool;
