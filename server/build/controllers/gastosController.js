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
class GastosControllers {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            if (req.body.reportesGastos_folio) {
                yield database_1.default.query('INSERT INTO gastos set ?', [req.body], function (err, result, fields) {
                    if (err)
                        throw err;
                    //console.log(result)
                    res = res.json({ result: result, foliogasto: req.body.foliogasto });
                    return res;
                });
            }
            else {
                res.json({ error: "Ocurrió un error" });
            }
        });
    }
    updategasto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE gastos set foliogasto='${req.body.foliogasto}-${req.body.idGasto.toString()}'
        WHERE idGastos=${req.body.idGasto}`, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
                return res;
            });
        });
    }
    getFoliosFactura(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`select folioFactura from gastos`, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    checkFolioGasto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`select idGastos from gastos`, function (err, result, fields) {
                if (err)
                    throw err;
                console.log(result);
                res = res.json(result);
            });
        });
    }
    registrarcc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO gastos_has_centrocostos set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                console.log(result);
                res = res.json(result);
            });
        });
    }
    getGastosSinEvidencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query(`SELECT * FROM (SELECT g.idGastos, DATE_FORMAT(g.fecha_gastos, '%Y-%m-%d') as fecha, g.proveedor, g.rfcProveedor, g.tipoGasto, g.conceptoGasto, g.descripcionConcepto, g.importeTotal, g.facturado, count(idGastos) as numArchivos
        FROM gastos AS g
        LEFT JOIN evidencias_gastos AS eg
        ON g.idGastos = eg.gastos_idGastos
        LEFT JOIN reportesgastos AS r
        ON g.reportesGastos_folio = r.folio
        LEFT JOIN empleados AS e
        ON e.numEmp = r.empleados_numEmp
        WHERE g.facturado = 'Facturado' && e.numEmp = ?
        GROUP BY idGastos) as a WHERE a.numArchivos < 2`, req.body.numEmp, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
}
const gastosController = new GastosControllers();
exports.default = gastosController;
