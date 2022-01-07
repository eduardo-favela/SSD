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
class ProductoFaltanteController {
    getProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT idproducto as id, concat(codigo,'-',descripcion) as descripcion,
         descripcion as producto, presentacion from productos`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    registraProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`INSERT INTO detalle_reportes_faltante set ?`, [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getDetalleProductoFaltante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT concat(productos.codigo,' - ', productos.descripcion) as producto,
            productos.presentacion as presentacion, detalle_reportes_faltante.cantidad as cantidad
            FROM detalle_reportes_faltante
            inner join productos on detalle_reportes_faltante.productos_idproducto=productos.idproducto
            where detalle_reportes_faltante.reportes_idreporte = ?`, [req.body.idReporte], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getComentariosReporte(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT empleados.nombreEmpleado as empleado, puestos.puesto as puesto, comentarios as comentario, 
            DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as fecha
            FROM comentarios_reportes
            inner join empleados on comentarios_reportes.empleados_numEmp = empleados.numEmp
            inner join puestos on empleados.puesto = puestos.idpuesto
            where reportes_fallas_idreporte= ?`, [req.body.idReporte], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
const productoFaltanteController = new ProductoFaltanteController();
exports.default = productoFaltanteController;
