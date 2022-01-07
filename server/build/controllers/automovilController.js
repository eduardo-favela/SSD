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
class AutomovilController {
    getinfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            yield (yield database_1.default).query(`select idAuto, autos.empleados_numEmp,marca,descripcion, serie, modelo, cc, ifnull(autos.kilometraje,0) as kilometraje
        from autos left join reportesgastos on autos.empleados_numEmp=reportesgastos.empleados_numEmp
        where autos.empleados_numEmp=? order by reportesgastos.folio desc limit 1`, [req.body.numEmp], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                else {
                    res = res.json(result[0]);
                }
            });
        });
    }
    updatekm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            yield (yield database_1.default).query(`UPDATE autos SET kilometraje=? WHERE idAuto=?`, [req.body.nuevokm, req.body.idAuto], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                else {
                    res = res.json(result[0]);
                }
            });
        });
    }
    getinfovacio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            yield (yield database_1.default).query(`select idAuto, autos.empleados_numEmp,marca,descripcion, serie, modelo, cc, ifnull(reportesgastos.kilometraje,0) as kilometraje
        from autos left join reportesgastos on autos.empleados_numEmp=reportesgastos.empleados_numEmp
        where autos.empleados_numEmp=? and reportesgastos.tipoauto=? order by reportesgastos.folio desc limit 1`, [req.body.numEmp, req.body.tipoauto], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                else {
                    res = res.json(result[0]);
                }
            });
        });
    }
    getinfofull(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            yield (yield database_1.default).query(`select idAuto, autos.empleados_numEmp,marca,descripcion, serie, modelo, cc, ifnull(reportesgastos.kilometraje,0) as kilometraje
        from autos left join reportesgastos on autos.empleados_numEmp=reportesgastos.empleados_numEmp
        where autos.empleados_numEmp=? and reportesgastos.tipoauto=? and kilometraje <> 0 order by reportesgastos.folio desc limit 1`, [req.body.numEmp, req.body.tipoauto], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                else {
                    res = res.json(result[0]);
                }
            });
        });
    }
    getultimokmengasto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            if (req.body.conceptoGasto == 'Gasolina por tarjeta de débito') {
                yield (yield database_1.default).query(`select idGastos, date_format(fecha_gastos,'%Y-%m-%d') as fecha, gastos.kilometraje from gastos 
            inner join reportesgastos on gastos.reportesGastos_folio=reportesgastos.folio
            where reportesgastos.empleados_numEmp=? and conceptoGasto=?  and tipoauto=? 
            order by fecha_gastos desc limit 10`, [req.body.numEmp, req.body.conceptoGasto, req.body.tipoauto], function (err, result, fields) {
                    if (err)
                        throw console.error(err);
                    else {
                        res = res.json(result);
                    }
                });
            }
            else if (req.body.conceptoGasto == 'Gasolina por ticket car') {
                yield (yield database_1.default).query(`select idGastos, date_format(fecha_gastos,'%Y-%m-%d') as fecha, gastos.kilometraje from gastos 
            inner join reportesgastos on gastos.reportesGastos_folio=reportesgastos.folio
            where reportesgastos.empleados_numEmp=? and conceptoGasto in('Gasolina por ticket car','Gasolina por tarjeta de débito')  and tipoauto=? 
            order by fecha_gastos desc limit 10`, [req.body.numEmp, req.body.tipoauto], function (err, result, fields) {
                    if (err)
                        throw console.error(err);
                    else {
                        res = res.json(result);
                    }
                });
            }
        });
    }
    getultimokmenreporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body)
            yield (yield database_1.default).query(`select folio, date_format(fecha,'%Y-%m-%d') as fecha, empleados_numEmp, kilometraje, tipoauto
        from reportesgastos where 
        empleados_numEmp=? and tipoauto=? order by folio desc limit 1;`, [req.body.numEmp, req.body.tipoauto], function (err, result, fields) {
                if (err)
                    throw console.error(err);
                else {
                    res = res.json(result[0]);
                }
            });
        });
    }
}
const automovilController = new AutomovilController();
exports.default = automovilController;
