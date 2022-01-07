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
class RegistroDepositoController {
    registrardeposito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* console.log(req.body) */
            yield (yield database_1.default).query(`INSERT INTO depositos set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                //res.json({message:"ok"})
                res = res.json(result);
                return res;
            });
        });
    }
    getdeposito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield database_1.default).query(`SELECT iddepositos, puntoventa,valorventa,fechaventa,
            importedeposito,fechadeposito,referencia,
            empleados.nombreEmpleado,bancos.banco_nombre, evidencias_depositos.nombrearchivo
            FROM 
            depositos inner join empleados on depositos.empleados_numEmp=empleados.numEmp
            inner join bancos on depositos.bancos_idbanco=bancos.idbanco
            left join evidencias_depositos on evidencias_depositos.depositos_iddepositos=depositos.iddepositos
            where ?`, [req.query], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                res.json(result);
            });
        });
    }
    getDepositosId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.query(`SELECT iddepositos from depositos`, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getDepositosConDiferencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.query(`SELECT iddepositos, concat(idCentrosCostos, ', ', trim(descripcion)) as puntoventa,
            distritos.distrito as distrito , date_format(fechaventa,'%Y-%m-%d') as fechaventa, turno, valorventa,
            importedeposito, diferencia FROM ggycb_db.depositos
            inner join centrocostos on depositos.puntoventa=centrocostos.idCentrosCostos
            inner join distritos on centrocostos.distritos_idDistrito=distritos.idDistrito
            where diferencia > 0 and distritos_idDistrito = ?`, [req.body.idDistrito], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getDepositosConDiferenciaRegion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.query(`SELECT iddepositos, concat(idCentrosCostos, ', ', trim(descripcion)) as puntoventa,
            distritos.distrito as distrito , date_format(fechaventa,'%Y-%m-%d') as fechaventa, turno, valorventa,
            importedeposito, diferencia FROM ggycb_db.depositos
            inner join centrocostos on depositos.puntoventa=centrocostos.idCentrosCostos
            inner join distritos on centrocostos.distritos_idDistrito=distritos.idDistrito
            where diferencia > 0 and distritos.regiones_idregion=?`, [req.body.idRegion], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getDiferenciaDeposito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.query(`SELECT (? - IFNULL (SUM(complementos_deposito.monto_complemento),0)) as diferencia 
            FROM complementos_deposito where complementos_deposito.depositos_iddepositos= ?`, [req.body.diferencia, req.body.idDeposito], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result[0]);
            });
        });
    }
    registraComplemetoDeposito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.query(`INSERT INTO complementos_deposito set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getComplemetosDeposito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.query(`SELECT referencia, monto_complemento as monto, date_format(created_at, '%Y-%m-%d %H:%i:%s') as fecha 
            FROM complementos_deposito where complementos_deposito.depositos_iddepositos= ?`, [req.body.idDeposito], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getDepositosSinEvidencias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body.idDistrito);
            database_1.default.query(`SELECT d.iddepositos, cc.descripcion , d.valorventa, DATE_FORMAT(d.fechaventa, '%Y-%m-%d') as fecha_venta, d.importedeposito, DATE_FORMAT(fechadeposito, '%Y-%m-%d') as fecha_deposito, d.referencia, e.nombreEmpleado, b.banco_nombre, d.diferencia
        FROM depositos AS d
        LEFT JOIN evidencias_depositos AS ed
        ON d.iddepositos = ed.depositos_iddepositos
        LEFT JOIN centrocostos AS cc
        ON d.puntoventa = cc.idCentrosCostos
        LEFT JOIN empleados AS e
        ON d.empleados_numEmp = e.numEmp 
        LEFT JOIN bancos AS b
        ON d.bancos_idbanco = b.idbanco
        LEFT JOIN distritos as di
        ON di.idDistrito = e.distritos_idDistrito
        WHERE ed.idevidencias_depositos IS null && e.distritos_idDistrito = ?`, req.body.idDistrito, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getReferencias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body.idDistrito);
            database_1.default.query(`SELECT referencia FROM depositos`, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
}
const registroDepositoController = new RegistroDepositoController();
exports.default = registroDepositoController;
