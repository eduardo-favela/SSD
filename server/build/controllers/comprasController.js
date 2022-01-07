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
exports.default = comprasController;
