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
const databasefb_1 = __importDefault(require("../databasefb"));
const moment_1 = __importDefault(require("moment"));
const node_cron_1 = __importDefault(require("node-cron"));
class ComprasController {
    getalmacenes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`select * from almacenes`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getInfoMovInventprueba() {
        return __awaiter(this, void 0, void 0, function* () {
            let almacenes = [3, 4];
            let fecha = new Date();
            let nuevafecha = moment_1.default(fecha.setDate(fecha.getDate() - 1)).format('YYYY-MM-DD');
            yield databasefb_1.default.get(function (err, dbfire) {
                if (err)
                    throw err;
                dbfire.query(`SELECT
            almacen
           ,fecha
           ,articulo
           ,SUM(entrada) Entrada
           ,SUM(salida) Salida
            FROM
            (
                SELECT
                        case
                        when din.almacen_destino_id = 19 then 3
                        when din.almacen_destino_id = 22944 then 3
                        when din.almacen_destino_id = 1355 then 4
                        when din.almacen_destino_id = 22945 then 4
                        when din.almacen_id = 19 then 3
                        when din.almacen_id = 22944 then 3
                        when din.almacen_id = 1355 then 4
                        when din.almacen_id = 22945 then 4
                        else 0
                        end almacen
                    ,din.fecha
                    ,dind.clave_articulo articulo
                    ,case
                        when din.almacen_destino_id = 19 then dind.unidades
                        when din.almacen_destino_id = 22944 then dind.unidades
                        when din.almacen_destino_id = 1355 then dind.unidades
                        when din.almacen_destino_id = 22945 then dind.unidades
                        when dind.tipo_movto = 'E' then dind.unidades
                        else 0
                        end Entrada
                    ,case
                        when din.almacen_destino_id = 19 then 0
                        when din.almacen_destino_id = 22944 then 0
                        when din.almacen_destino_id = 1355 then 0
                        when din.almacen_destino_id = 22945 then 0
                        when dind.tipo_movto = 'S' then dind.unidades
                        else 0
                        end Salida
                FROM
                    doctos_in  din
                    join
                            doctos_in_det  dind
                        on
                            dind.docto_in_id = din.docto_in_id
                WHERE
                        din.fecha  = '${nuevafecha}'
                        AND
                        din.cancelado = 'N'
                        and
                        COALESCE(Din.almacen_destino_id,0) not in (10523, 10855)
                        AND
                        dind.concepto_in_id  not in (25)

            ) MovtosAlmacen
            WHERE
                almacen > 0
            GROUP BY
                almacen
                ,fecha
                ,articulo`, [], function (err, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            throw err;
                        /* console.log(result) */
                        for (let j = 0; j < almacenes.length; j++) {
                            let productos = yield database_1.default.query(`SELECT movinventariodet.productos_codigo as codigo, movinventariodet.invfinal as invinicial
                from movinventariodet
                where movinventariodet.movinventario_id_movinventario = (SELECT id_movinventario FROM movinventario 
                WHERE almacenes_idalmacen = ${almacenes[j]} ORDER BY id_movinventario DESC LIMIT 1);`);
                            console.log(`INSERT INTO movinventario SET almacenes_idalmacen = ${almacenes[j]}, fecha = '${nuevafecha}'`);
                            for (let i = 0; i < productos.length; i++) {
                                productos[i].movinventario_id_movinventario = 489;
                                let results = result.filter(obj => {
                                    return obj.ALMACEN === almacenes[j];
                                });
                                if (results.find((obj) => { return parseInt(obj.ARTICULO) === productos[i].codigo; })) {
                                    productos[i].entradas = results.find((obj) => { return parseInt(obj.ARTICULO) === productos[i].codigo; }).ENTRADA;
                                    productos[i].salidas = results.find((obj) => { return parseInt(obj.ARTICULO) === productos[i].codigo; }).SALIDA;
                                    productos[i].invfinal = ((productos[i].invinicial + productos[i].entradas) - productos[i].salidas);
                                }
                                else {
                                    productos[i].invfinal = productos[i].invinicial;
                                    productos[i].entradas = 0;
                                    productos[i].salidas = 0;
                                }
                                console.log(productos[i]);
                            }
                        }
                    });
                });
                dbfire.detach();
                console.log('DB firebird has connected');
            });
            databasefb_1.default.destroy();
        });
    }
    getInfoMovInvent() {
        return __awaiter(this, void 0, void 0, function* () {
            node_cron_1.default.schedule('0 30 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
                console.log('Corriendo proceso de media noche');
                let fecha = new Date();
                let nuevafecha = moment_1.default(fecha.setDate(fecha.getDate() - 1)).format('YYYY-MM-DD');
                let almacenes = [3, 4];
                let registros = yield database_1.default.query(`SELECT productos.codigo, productos.producto, productos.unidad_medida, 
            movinventariodet.invinicial, movinventariodet.entradas, movinventariodet.salidas, 
            movinventariodet.invfinal, movinventario.id_movinventario
            from productos
            left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
            left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
            where fecha = ? and (almacenes_idalmacen = ? or almacenes_idalmacen = ?)
            ORDER BY productos.producto;`, [nuevafecha, almacenes[0], almacenes[1]]);
                if (registros.length === 0) {
                    yield databasefb_1.default.get(function (err, dbfire) {
                        if (err)
                            throw err;
                        dbfire.query(`SELECT
                    almacen
                ,fecha
                ,articulo
                ,SUM(entrada) Entrada
                ,SUM(salida) Salida
                    FROM
                    (
                        SELECT
                                case
                                when din.almacen_destino_id = 19 then 3
                                when din.almacen_destino_id = 22944 then 3
                                when din.almacen_destino_id = 1355 then 4
                                when din.almacen_destino_id = 22945 then 4
                                when din.almacen_id = 19 then 3
                                when din.almacen_id = 22944 then 3
                                when din.almacen_id = 1355 then 4
                                when din.almacen_id = 22945 then 4
                                else 0
                                end almacen
                            ,din.fecha
                            ,dind.clave_articulo articulo
                            ,case
                                when din.almacen_destino_id = 19 then dind.unidades
                                when din.almacen_destino_id = 22944 then dind.unidades
                                when din.almacen_destino_id = 1355 then dind.unidades
                                when din.almacen_destino_id = 22945 then dind.unidades
                                when dind.tipo_movto = 'E' then dind.unidades
                                else 0
                                end Entrada
                            ,case
                                when din.almacen_destino_id = 19 then 0
                                when din.almacen_destino_id = 22944 then 0
                                when din.almacen_destino_id = 1355 then 0
                                when din.almacen_destino_id = 22945 then 0
                                when dind.tipo_movto = 'S' then dind.unidades
                                else 0
                                end Salida
                        FROM
                            doctos_in  din
                            join
                                    doctos_in_det  dind
                                on
                                    dind.docto_in_id = din.docto_in_id
                        WHERE
                                din.fecha  = '${nuevafecha}'
                                AND
                                din.cancelado = 'N'
                                and
                                COALESCE(Din.almacen_destino_id,0) not in (10523, 10855)
                                AND
                                dind.concepto_in_id  not in (25)
        
                    ) MovtosAlmacen
                    WHERE
                        almacen > 0
                    GROUP BY
                        almacen
                        ,fecha
                        ,articulo`, [], function (err, result) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                for (let i = 0; i < almacenes.length; i++) {
                                    let productos = yield database_1.default.query(`SELECT movinventariodet.productos_codigo, movinventariodet.invfinal as invinicial
                        from movinventariodet
                        where movinventariodet.movinventario_id_movinventario = (SELECT id_movinventario FROM movinventario 
                        WHERE almacenes_idalmacen = ${almacenes[i]} ORDER BY id_movinventario DESC LIMIT 1);`);
                                    let insertedinvent = yield database_1.default.query(`INSERT INTO movinventario SET almacenes_idalmacen = ${almacenes[i]}, fecha = '${nuevafecha}'`);
                                    let results = result.filter(obj => {
                                        return obj.ALMACEN === almacenes[i];
                                    });
                                    for (let j = 0; j < productos.length; j++) {
                                        productos[j].movinventario_id_movinventario = insertedinvent.insertId;
                                        if (results.find((obj) => { return parseInt(obj.ARTICULO) === productos[j].productos_codigo; })) {
                                            productos[j].entradas = results.find((obj) => { return parseInt(obj.ARTICULO) === productos[j].productos_codigo; }).ENTRADA;
                                            productos[j].salidas = results.find((obj) => { return parseInt(obj.ARTICULO) === productos[j].productos_codigo; }).SALIDA;
                                            productos[j].invfinal = ((productos[j].invinicial + productos[j].entradas) - productos[j].salidas);
                                        }
                                        else {
                                            productos[j].entradas = 0;
                                            productos[j].salidas = 0;
                                            productos[j].invfinal = productos[j].invinicial;
                                        }
                                        /* console.log(productos[j]) */
                                        yield database_1.default.query(`INSERT INTO movinventariodet SET ?`, [productos[j]]);
                                    }
                                }
                            });
                        });
                        dbfire.detach();
                        console.log('Datos actualizados');
                    });
                    databasefb_1.default.destroy();
                }
                else {
                    console.log('productos ya registrados');
                }
            }));
        });
    }
    getinventario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT productos.codigo, productos.producto, productos.unidad_medida, 
        movinventariodet.invinicial, movinventariodet.entradas, movinventariodet.salidas, 
        movinventariodet.invfinal, movinventario.id_movinventario
        from productos
        left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
        left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
        where fecha = ? and almacenes_idalmacen = ?
        ORDER BY productos.producto;`, [req.body.fecha, req.body.idalmacen], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getinventarioant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT productos.codigo, invfinal
              from productos
              left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
              left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
              where fecha= ? and almacenes_idalmacen = ? 
              order by productos.producto;`, [req.body.fecha, req.body.idalmacen], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    getproducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query(`SELECT * from productos ORDER BY productos.producto;`, function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    updateinvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('DELETE FROM movinventariodet WHERE movinventario_id_movinventario = ?', [req.body.folioinvent], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    setinvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO movinventario SET ?', [req.body.invent], function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    setinventdet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < req.body.invent.length; index++) {
                req.body.invent[index].movinventario_id_movinventario = req.body.folioinvent;
                yield database_1.default.query('INSERT INTO movinventariodet SET ?', [req.body.invent[index]]);
            }
            console.log(req.body.invent);
            res.json(true);
        });
    }
    getproductosDI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let productsok = [];
            let productswarning = [];
            let productsalert = [];
            let productosdesp = yield database_1.default.query(`SELECT productos.codigo, productos.producto, SUM(movinventariodet.salidas)/9 as desplazamiento, 
        productos.tiempo_respuesta_prov as tiemporesprov,
        productos.factor_seguridad as factorseg, productos.dias_piso as diaspiso
        from productos
        left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
        left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
        where fecha between ? and ? and almacenes_idalmacen = ?
        group by productos.codigo;`, [req.body.fechaini, req.body.fechafin, req.body.almacen]);
            for (let index = 0; index < productosdesp.length; index++) {
                let invfinalprod = yield database_1.default.query(`SELECT invfinal 
            FROM movinventariodet
            LEFT JOIN movinventario ON movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
            WHERE productos_codigo = ? ORDER BY fecha DESC LIMIT 1;`, [productosdesp[index].codigo]);
                productosdesp[index].invfinal = invfinalprod[0].invfinal;
                productosdesp[index].diasinvex = (productosdesp[index].invfinal / productosdesp[index].desplazamiento);
                productosdesp[index].diasinvporcubrir = ((productosdesp[index].diaspiso + productosdesp[index].factorseg + productosdesp[index].tiemporesprov) - productosdesp[index].diasinvex);
                if (productosdesp[index].diasinvex >= (productosdesp[index].diaspiso + productosdesp[index].factorseg + productosdesp[index].tiemporesprov)) {
                    productsok.push(productosdesp[index]);
                }
                else if (productosdesp[index].diasinvex >= (productosdesp[index].diaspiso + productosdesp[index].tiemporesprov)) {
                    productswarning.push(productosdesp[index]);
                }
                else {
                    productsalert.push(productosdesp[index]);
                }
            }
            const products = { productsalert: productsalert, productsok: productsok, productswarning: productswarning };
            res.json(products);
        });
    }
}
const comprasController = new ComprasController();
comprasController.getInfoMovInvent();
exports.default = comprasController;
