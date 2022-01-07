"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class EvidenciasController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.idevidencias = null;
            //console.log(req.body)
            if (req.body.nombrearchivo && req.body.gastos_idGastos) {
                yield database_1.default.query('INSERT INTO evidencias_gastos set ?', [req.body], function (err, result, fields) {
                    if (err)
                        throw err;
                    res = res.json(result);
                    return res;
                });
            }
            else {
                res.json({ error: "Ocurrió un error" });
            }
        });
    }
    createEvidenciaDepositos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            req.body.idevidencias_depositos = null;
            if (req.body) {
                yield database_1.default.query('INSERT INTO evidencias_depositos set ?', [req.body], function (err, result, fields) {
                    if (err)
                        throw err;
                    res = res.json(result);
                    return res;
                });
            }
            else {
                res.json({ error: "Ocurrió un error" });
            }
        });
    }
}
const evidenciasController = new EvidenciasController();
exports.default = evidenciasController;
