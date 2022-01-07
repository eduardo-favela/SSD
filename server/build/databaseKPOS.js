"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import sql  from 'mssql'
const sql = require('mssql');
const keysKPOS_1 = __importDefault(require("./keysKPOS"));
/* const {keys}=require('./keys') */
const pool = new sql.ConnectionPool(keysKPOS_1.default.database);
const poolconnected = pool.connect().then(((poolconnected) => {
    console.log('KPOS DB is connected');
}));
exports.default = pool;
