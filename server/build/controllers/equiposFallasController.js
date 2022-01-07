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
class EquiposFallasController {
    getEquipos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`select * from equipo_pv`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
            //res.json({message: 'ok'})
        });
    }
    getFallas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`select idfallas_equipo as id, falla from equipo_pv_has_fallas_equipo 
        inner join fallas_equipo on equipo_pv_has_fallas_equipo.fallas_equipo_idfallas_equipo=fallas_equipo.idfallas_equipo
        inner join equipo_pv on equipo_pv_has_fallas_equipo.equipo_pv_id=equipo_pv.id
        where equipo_pv_id=?`, [req.body.id], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
            //res.json({message: 'ok'})
        });
    }
    registraReporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO reportes set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    registraEquipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO detalle_reportes_fallas set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getReportesDistrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idreporte, concat(centrocostos.idCentrosCostos,'-',centrocostos.descripcion) as centrocostos,
        DATE_FORMAT( reportes.fecha,  '%Y-%m-%d' ) as fecha, empleados.nombreEmpleado, tiporeporte.tiporeporte, reportes.comentarios,
        estatus_reporte.estatus_reporte, distritos.distrito FROM reportes
        INNER JOIN centrocostos on reportes.centrocostos_idCentrosCostos=centrocostos.idCentrosCostos
        INNER JOIN distritos on centrocostos.distritos_idDistrito=distritos.idDistrito
        INNER JOIN empleados on reportes.empleados_numEmp=empleados.numEmp
        INNER JOIN tiporeporte on reportes.tiporeporte_id=tiporeporte.id
        INNER JOIN estatus_reporte on reportes.estatus_reporte_id=estatus_reporte.id
        where centrocostos.distritos_idDistrito=? and estatus_reporte.id in (?) and tiporeporte.id=?`, [req.body.distrito, req.body.estatus, req.body.tiporeporte], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getEstatusReporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * FROM estatus_reporte`, function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    updateEstatusRep(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`UPDATE reportes SET estatus_reporte_id = ? WHERE idreporte = ?`, [req.body.estatus_reporte, req.body.idreporte], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    registraComentarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO comentarios_reportes set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
    getDetalleReporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT equipo_pv.nombre as nombre, fallas_equipo.falla as falla, detalle_reportes_fallas.descripcion_falla
            FROM detalle_reportes_fallas
            inner join equipo_pv on detalle_reportes_fallas.equipo_pv_id=equipo_pv.id
            inner join fallas_equipo on detalle_reportes_fallas.fallas_equipo_idfallas_equipo=fallas_equipo.idfallas_equipo
            where reportes_fallas_idreporte= ?`, [req.body.idReporte], function (err, result, fields) {
                if (err)
                    throw err;
                res = res.json(result);
            });
        });
    }
}
const equiposFallasController = new EquiposFallasController();
exports.default = equiposFallasController;
