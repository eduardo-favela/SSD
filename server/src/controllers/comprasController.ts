import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../database'
import * as moment from 'moment';


class ComprasController {
    public async getalmacenes(req: Request, res: Response){
        await db.query(`select * from almacenes`, function(err :any, result:any, fields:any){
            if(err) throw err
            res.json(result)
        });
    }

    public async getinventario(req: Request, res: Response){
        await db.query(`SELECT productos.codigo, productos.producto, productos.unidad_medida, 
        movinventariodet.invinicial, movinventariodet.entradas, movinventariodet.salidas, 
        movinventariodet.invfinal, movinventario.id_movinventario
        from productos
        left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
        left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
        where fecha = ? and almacenes_idalmacen = ?
        ORDER BY productos.producto;`, [req.body.fecha, req.body.idalmacen],function(err:any,result:any,fields:any){
            if(err) throw err
            res.json(result)
        });
    }

    public async getinventarioant(req: Request, res: Response){
        await db.query(`SELECT productos.codigo, invfinal
              from productos
              left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
              left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
              where fecha= ? and almacenes_idalmacen = ? 
              order by productos.producto;`, [req.body.fecha, req.body.idalmacen],function(err:any,result:any,fields:any){
                  if(err) throw err
                  res.json(result)
              });
    }
    public async getproducts(req: Request, res: Response){
        await db.query(`SELECT * from productos ORDER BY productos.producto;`,function(err:any,result:any,fields:any){
                  if(err) throw err
                  res.json(result)
              });
    }
    public async updateinvent(req: Request, res: Response){
        await db.query('DELETE FROM movinventariodet WHERE movinventario_id_movinventario = ?',
        [req.body.folioinvent],function(err:any,result:any,fields:any){
            if(err) throw err
            res.json(result)
        });
    }
    public async setinvent(req: Request, res: Response){
        await db.query('INSERT INTO movinventario SET ?',[req.body.invent], function(err:any,result:any,fields:any){
            if(err) throw err
            res.json(result)
        });
    }

    public async setinventdet(req: Request, res: Response){
        for (let index = 0; index < req.body.invent.length; index++) {
            req.body.invent[index].movinventario_id_movinventario=req.body.folioinvent
            await db.query('INSERT INTO movinventariodet SET ?',[req.body.invent[index]])
        }
        console.log(req.body.invent)
        res.json(true)
    }

    public async getproductosDI(req: Request, res: Response){
        let productsok : any = []
        let productswarning : any = []
        let productsalert : any = []

        let productosdesp : any = await db.query(`SELECT productos.codigo, productos.producto, SUM(movinventariodet.salidas)/9 as desplazamiento, 
        productos.tiempo_respuesta_prov as tiemporesprov,
        productos.factor_seguridad as factorseg, productos.dias_piso as diaspiso
        from productos
        left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
        left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
        where fecha between ? and ? and almacenes_idalmacen = ?
        group by productos.codigo;`, [req.body.fechaini, req.body.fechafin, req.body.almacen])
        
        for (let index = 0; index < productosdesp.length; index++) {
            let invfinalprod : any = await db.query(`SELECT invfinal 
            FROM movinventariodet
            LEFT JOIN movinventario ON movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
            WHERE productos_codigo = ? ORDER BY fecha DESC LIMIT 1;`, [productosdesp[index].codigo])
            productosdesp[index].invfinal = invfinalprod[0].invfinal
            productosdesp[index].diasinvex = (productosdesp[index].invfinal/productosdesp[index].desplazamiento)
            productosdesp[index].diasinvporcubrir = ((productosdesp[index].diaspiso+productosdesp[index].factorseg+productosdesp[index].tiemporesprov)-productosdesp[index].diasinvex)

            if (productosdesp[index].diasinvex>=(productosdesp[index].diaspiso+productosdesp[index].factorseg+productosdesp[index].tiemporesprov)) {
                productsok.push(productosdesp[index])
            }
            else if(productosdesp[index].diasinvex>=(productosdesp[index].diaspiso+productosdesp[index].tiemporesprov)){
                productswarning.push(productosdesp[index])
            }
            else{
                productsalert.push(productosdesp[index])
            }
        }
        const products = {productsalert:productsalert, productsok:productsok, productswarning:productswarning}
        res.json(products)
    }
}

const comprasController = new ComprasController()
export default comprasController