import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../database'
import dbfb from '../databasefb';
import moment from 'moment';
import cron from 'node-cron'


class ComprasController {
    public async getalmacenes(req: Request, res: Response){
        await db.query(`select * from almacenes`, function(err :any, result:any, fields:any){
            if(err) throw err
            res.json(result)
        });
    }

    public async getInfoMovInventprueba(){
        let almacenes = [3,4]
        let fecha = new Date()
        let nuevafecha = moment(fecha.setDate(fecha.getDate()-1)).format('YYYY-MM-DD')
        await dbfb.get(function(err, dbfire) {
            if (err) throw err;
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
                ,articulo`,[], async function(err,result){
            if(err) throw err
            /* console.log(result) */

            for (let j = 0; j < almacenes.length; j++) {
                let productos = await db.query(`SELECT movinventariodet.productos_codigo as codigo, movinventariodet.invfinal as invinicial
                from movinventariodet
                where movinventariodet.movinventario_id_movinventario = (SELECT id_movinventario FROM movinventario 
                WHERE almacenes_idalmacen = ${almacenes[j]} ORDER BY id_movinventario DESC LIMIT 1);`)

                console.log(`INSERT INTO movinventario SET almacenes_idalmacen = ${almacenes[j]}, fecha = '${nuevafecha}'`)
    
                for (let i = 0; i < productos.length; i++) {
                    productos[i].movinventario_id_movinventario = 489
                    let results = result.filter(obj => {
                        return obj.ALMACEN === almacenes[j]
                    })
    
                    if (results.find((obj: { ARTICULO : any; }) => {return parseInt(obj.ARTICULO) === productos[i].codigo})) {
                        productos[i].entradas = results.find((obj: { ARTICULO : any; }) => {return parseInt(obj.ARTICULO) === productos[i].codigo}).ENTRADA
                        productos[i].salidas = results.find((obj: { ARTICULO : any; }) => {return parseInt(obj.ARTICULO) === productos[i].codigo}).SALIDA
                        productos[i].invfinal = ((productos[i].invinicial + productos[i].entradas)-productos[i].salidas)
                    }
                    else{
                        productos[i].invfinal = productos[i].invinicial
                        productos[i].entradas = 0
                        productos[i].salidas = 0
                    }
                    console.log(productos[i]);
                }
            }
        })
            dbfire.detach();
            console.log('DB firebird has connected')
        });
        dbfb.destroy()
    }

    public async getInfoMovInvent(){

        cron.schedule('0 30 0 * * *', async () => {
            console.log('Corriendo proceso de media noche');
            let fecha = new Date()
            let nuevafecha = moment(fecha.setDate(fecha.getDate()-1)).format('YYYY-MM-DD')
            let almacenes = [3,4]

            let registros = await db.query(`SELECT productos.codigo, productos.producto, productos.unidad_medida, 
            movinventariodet.invinicial, movinventariodet.entradas, movinventariodet.salidas, 
            movinventariodet.invfinal, movinventario.id_movinventario
            from productos
            left join movinventariodet on movinventariodet.productos_codigo = productos.codigo
            left join movinventario on movinventariodet.movinventario_id_movinventario=movinventario.id_movinventario
            where fecha = ? and (almacenes_idalmacen = ? or almacenes_idalmacen = ?)
            ORDER BY productos.producto;`,[nuevafecha,almacenes[0],almacenes[1]])

            if(registros.length===0){
                await dbfb.get(function(err, dbfire) {
                    if (err) throw err;
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
                        ,articulo`,[], 
                async function(err,result){
                if(err) throw err
                for (let i = 0; i < almacenes.length; i++) {
                        let productos = await db.query(`SELECT movinventariodet.productos_codigo, movinventariodet.invfinal as invinicial
                        from movinventariodet
                        where movinventariodet.movinventario_id_movinventario = (SELECT id_movinventario FROM movinventario 
                        WHERE almacenes_idalmacen = ${almacenes[i]} ORDER BY id_movinventario DESC LIMIT 1);`)
        
                        let insertedinvent = await db.query(`INSERT INTO movinventario SET almacenes_idalmacen = ${almacenes[i]}, fecha = '${nuevafecha}'`)
        
                        let results = result.filter(obj => {
                            return obj.ALMACEN === almacenes[i]
                        })
        
                        for (let j = 0; j < productos.length; j++) {
                            productos[j].movinventario_id_movinventario = insertedinvent.insertId
                            if (results.find((obj: { ARTICULO : any; }) => {return parseInt(obj.ARTICULO) === productos[j].productos_codigo})) {
                                productos[j].entradas = results.find((obj: { ARTICULO : any; }) => {return parseInt(obj.ARTICULO) === productos[j].productos_codigo}).ENTRADA
                                productos[j].salidas = results.find((obj: { ARTICULO : any; }) => {return parseInt(obj.ARTICULO) === productos[j].productos_codigo}).SALIDA
                                productos[j].invfinal = ((productos[j].invinicial + productos[j].entradas)-productos[j].salidas)
                            }
                            else{
                                productos[j].entradas = 0
                                productos[j].salidas = 0
                                productos[j].invfinal = productos[j].invinicial
                            }
                            /* console.log(productos[j]) */
                            await db.query(`INSERT INTO movinventariodet SET ?`, [productos[j]])
                        }
                    }
                })
                    dbfire.detach();
                    console.log('Datos actualizados')
                });
                dbfb.destroy()
            }
            else{
                console.log('productos ya registrados')
            }
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
comprasController.getInfoMovInvent()
export default comprasController