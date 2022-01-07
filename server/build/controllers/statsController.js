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
const moment_1 = __importDefault(require("moment"));
const sqlstring_1 = __importDefault(require("sqlstring"));
const databaseKPOS_1 = __importDefault(require("../databaseKPOS"));
const database_1 = __importDefault(require("../database"));
const convert_excel_to_json_1 = __importDefault(require("convert-excel-to-json"));
class StatsController {
    getVentasPV(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = sqlstring_1.default.format(`select articulos.Articulo, articulos.nombre, familia.Nombre as familia, sum(VentasDet.Cantidad) as 'cantidad_vendida' from turnos
            inner join ventas on ventas.FolioTurno=turnos.Folio
            inner join VentasDet on VentasDet.Folio=Ventas.Folio
            inner join articulos on VentasDet.Articulo=articulos.Articulo
            inner join familia on articulos.familia=familia.Familia
            where pventa in (?) and turnos.Fecha between ? and ? 
            group by articulos.Articulo, familia.Nombre, articulos.nombre`, [req.body.pventa, req.body.fecha1, req.body.fecha2]);
            yield databaseKPOS_1.default.query(query, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result.recordset);
            });
        });
    }
    getPresupuestosArticuloPV(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT SUM(presupuesto_unidades) as meta, articulos_id_articulo as articulo, familia.nombre_familia as familia FROM presupuestos
            inner join articulos_venta on presupuestos.articulos_id_articulo=articulos_venta.id_articulo
            inner join familia on articulos_venta.familia_id_familia=familia.id_familia
            WHERE articulos_id_articulo in (?)
            and date_format(fecha_presupuesto, '%Y-%m')=? and centrocostos_idCentrosCostos in (?) group by articulos_id_articulo, familia`, [req.body.articulos, req.body.fecha, req.body.pventa], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getStatsFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let statspventa = [];
            let filetojson = convert_excel_to_json_1.default({
                sourceFile: __dirname + '/../../src/stats/stats.xls',
                header: {
                    rows: 9
                },
                sheets: ['Detalle Personalizadas'],
                columnToKey: {
                    A: 'nombreRegDist',
                    B: 'pv',
                    C: 'nombrepv',
                    D: 'ciudad',
                    F: 'dias',
                    G: 'G',
                    J: 'J',
                    L: 'L',
                    M: 'M',
                    O: 'O',
                    Q: 'Q',
                    S: 'S',
                }
            });
            for (let i = 0; i < filetojson["Detalle Personalizadas"].length; i++) {
                if (filetojson["Detalle Personalizadas"][i].pv) {
                    statspventa.push(filetojson["Detalle Personalizadas"][i]);
                    //console.log(filetojson["Detalle Personalizadas"][i])
                }
            }
            res.json(statspventa);
        });
    }
    getVentaDiaria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let statsrow = [];
            let filetojson = convert_excel_to_json_1.default({
                sourceFile: __dirname + '/../../src/stats/stats2.xls',
                header: {
                    rows: 11
                },
                sheets: ['Resumen'],
                columnToKey: {
                    BH: 'dia',
                    BI: 'periodo',
                    BJ: 'numptsconventa',
                    BK: 'ventadiaria',
                    BL: 'promedioventa',
                    BM: 'diferenciadiasenpesos',
                    BN: 'diferenciadiasenporcentaje'
                }
            });
            for (let i = 0; i < filetojson["Resumen"].length; i++) {
                if (filetojson["Resumen"][i].dia) {
                    statsrow.push(filetojson["Resumen"][i]);
                    //console.log(filetojson["Detalle Personalizadas"][i])
                }
            }
            res.json(statsrow);
        });
    }
    getVentaSemanal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let statsrow = [];
            let filetojson = convert_excel_to_json_1.default({
                sourceFile: __dirname + '/../../src/stats/stats2.xls',
                header: {
                    rows: 11
                },
                sheets: ['Resumen'],
                columnToKey: {
                    BP: 'dia',
                    BQ: 'periodo',
                    BR: 'numptsconventa',
                    BS: 'ventadiaria',
                    BT: 'promedioventa',
                    BU: 'ventaacum',
                    BV: 'diferenciaacumenpesos',
                    BW: 'diferenciaacumenporcentaje'
                }
            });
            for (let i = 0; i < filetojson["Resumen"].length; i++) {
                if (filetojson["Resumen"][i].dia) {
                    statsrow.push(filetojson["Resumen"][i]);
                    //console.log(filetojson["Detalle Personalizadas"][i])
                }
            }
            res.json(statsrow);
        });
    }
    getVentasProdDiaBD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //let fecha = moment().format('YYYY-MM-DD')
            let fechamesant = new Date(moment_1.default().format('YYYY-MM-DD'));
            fechamesant.setDate(fechamesant.getDate()).toString();
            let fecha1 = `${fechamesant.getFullYear()}-${'0' + (fechamesant.getMonth() + 1).toString().slice(-2)}-${(fechamesant.getDate()).toString()}`;
            //console.log(fecha1)
            yield database_1.default.query(`SELECT * FROM venta_diaria_producto WHERE fecha_registro = ? limit 1`, [fecha1], function (err, result, fields) {
                if (err)
                    throw err;
                console.log('query para obtener ventas del dia anterior SELECT * FROM venta_diaria_producto WHERE fecha_registro = ' + fecha1 + ' limit 1');
                res.json(result);
            });
        });
    }
    getVentasProdBD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //OBTIENE LAS VENTAS POR PRODUCTO DE LA BASE DE DATOS DE 31 DÍAS ANTES, A LA FECHA ACTUAL
            //let fechadesdefecha = new Date(req.body.fecha)
            yield database_1.default.query(`SELECT venta_diaria_producto.pventa, venta_diaria_producto.producto, venta_diaria_producto.cantidad, ventasiniva,
        ventaconiva, iva, ieps, distritos.idDistrito, regiones.idregion, articulos_venta.nombre_articulo, 
        date_format(venta_diaria_producto.fecha_registro, '%Y-%m-%d') as fecha, venta_diaria_producto.diferencia as diferencia
        FROM venta_diaria_producto
        inner join centrocostos on venta_diaria_producto.pventa=centrocostos.idCentrosCostos
        inner join distritos on centrocostos.distritos_idDistrito=distritos.idDistrito
        inner join regiones on distritos.regiones_idregion=regiones.idregion
        inner join articulos_venta on venta_diaria_producto.producto=articulos_venta.id_articulo WHERE fecha_registro between ? and ? order by fecha_registro`, [req.body.fecha1, req.body.fecha2], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getVentasProdDiaBDPV(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //OBTIENE LAS VENTAS POR PRODUCTO Y POT PUNTO DE VENTA DE LA BASE DE DATOS DE 31 DÍAS ANTES, A LA FECHA ACTUAL
            yield database_1.default.query(`SELECT venta_diaria_producto.pventa, venta_diaria_producto.producto, venta_diaria_producto.cantidad, ventasiniva,
        ventaconiva, iva, ieps, distritos.idDistrito, regiones.idregion, articulos_venta.nombre_articulo, 
        date_format(venta_diaria_producto.fecha_registro, '%Y-%m-%d') as fecha, venta_diaria_producto.diferencia as diferencia
        FROM venta_diaria_producto
        inner join centrocostos on venta_diaria_producto.pventa=centrocostos.idCentrosCostos
        inner join distritos on centrocostos.distritos_idDistrito=distritos.idDistrito
        inner join regiones on distritos.regiones_idregion=regiones.idregion
        inner join articulos_venta on venta_diaria_producto.producto=articulos_venta.id_articulo WHERE producto = ? and venta_diaria_producto.pventa in (?)
        and fecha_registro between ? and ? order by fecha_registro`, [req.body.producto, req.body.puntosventa, req.body.fecha1, req.body.fecha2], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    setVentasProdBD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let contador = 0;
            for (let i = 0; i < req.body.ventas.length; i++) {
                //SE ENVÍA UNA CONSULTA A LA BASE DE DATOS POR CADA REGISTRO DE PRODUCTO PARA SABER CUAL ES LA CANTIDAD DE VENTA DEL DÍA ANTERIOR
                //PARA COMPARARLO CON EL ACTUAL, SACAR DIFERENCIA Y REGISTRARLO EN LA BASE DE DATOS EN EL CAMPO DIFERENCIA DE LA TABLA VENTA_DIARIA_PRODUCTO
                yield database_1.default.query(`select id, fecha_registro, cantidad, pventa 
            from venta_diaria_producto where venta_diaria_producto.fecha_registro = date_sub(?, interval 1 day) and producto=?
             and pventa in (?)`, [req.body.ventas[i].fecha_registro, req.body.ventas[i].producto, req.body.ventas[i].pventa], function (err, result, fields) {
                    if (err)
                        throw err;
                    if (result[0]) {
                        req.body.ventas[i].diferencia = (((req.body.ventas[i].cantidad - result[0].cantidad) < 0) ? (req.body.ventas[i].cantidad) : (req.body.ventas[i].cantidad - result[0].cantidad));
                        /* console.log('cantidad del dia anterior ',result[0].cantidad) */
                    }
                    else {
                        req.body.ventas[i].diferencia = req.body.ventas[i].cantidad;
                        /* console.log('result vacio', result, req.body.ventas[i].fecha_registro,req.body.ventas[i].producto,req.body.ventas[i].pventa) */
                    }
                });
            }
            for (let i = 0; i < req.body.ventas.length; i++) {
                contador++;
                yield database_1.default.query(`INSERT INTO venta_diaria_producto SET ?`, [req.body.ventas[i]], function (err, result, fields) {
                    if (err)
                        throw err;
                });
            }
            /* console.log(contador) */
            res.json({ status: true, registroscargados: contador });
        });
    }
    getVentasProdEX(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let statsrow = [];
            let fechamesant = new Date(moment_1.default().format('YYYY-MM-DD'));
            fechamesant.setDate(fechamesant.getDate()).toString();
            let fecha1 = `${fechamesant.getFullYear()}-${'0' + (fechamesant.getMonth() + 1).toString().slice(-2)}-${(fechamesant.getDate()).toString()}`;
            try {
                let filetojson = convert_excel_to_json_1.default({
                    sourceFile: __dirname + '/../../src/stats/stats3.xlsx',
                    header: {
                        rows: 3
                    },
                    sheets: ['Hoja1'],
                    columnToKey: {
                        A: 'pventa',
                        B: 'producto',
                        D: 'cantidad',
                        E: 'ventasiniva',
                        F: 'ventaconiva',
                        G: 'iva',
                        H: 'ieps'
                    }
                });
                for (let i = 0; i < filetojson["Hoja1"].length; i++) {
                    if (filetojson["Hoja1"][i].pventa) {
                        filetojson["Hoja1"][i].fecha_registro = fecha1;
                        statsrow.push(filetojson["Hoja1"][i]);
                        //console.log(filetojson["Detalle Personalizadas"][i])
                    }
                }
                res.json(statsrow);
            }
            catch (error) {
                /*  console.log('entro al error')
                 console.log(statsrow) */
                res.json({ error: error });
            }
        });
    }
}
const statsController = new StatsController();
exports.default = statsController;
