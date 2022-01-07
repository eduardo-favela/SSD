import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../database'


class LoginController {
    public async login(req: Request, res: Response){
        await db.query(`select * from usuarios where idusuario = ?`, [req.body.idusuario], function(err:any, result:any, fields:any){
            if(err) throw err
            if(result.length>0){
                bcrypt.compare(req.body.password, result[0].password, function(err, response) {
                    res.json(response)
                });
            }
            else{
                res.json(false)
            }
        });
    }

    public async setUser(req: Request, res: Response){

        //ESTE MÉTODO RECIBE UN OBJETO CON DOS PROPIEDADES, UNA LLAMADA user Y OTRA LLAMADA pass
        //CON ESTOS DATOS SE INSERTARÁ UN NUEVO USUARIO EN LA BASE DE DATOS CON UNA CONTRASEÑA ENCRIPTADA

        const saltRounds=16;
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            req.body.password=hash
            await db.query(`INSERT INTO usuarios set ?`, [req.body], function(err:any, result:any, fields:any){
                if(err) throw err
                res.json(result)
            });
        });
    }

    public async updateUser(req: Request, res: Response){

        //ESTE MÉTODO RECIBE UN OBJETO CON DOS PROPIEDADES, UNA LLAMADA user Y OTRA LLAMADA pass
        //LA PROPIEDAD pass ES LA NUEVA CONTRASEÑA DEL USUARIO Y LA PROPIERDAD user ES EL USUARIO AL QUE SE
        //LE VA A CAMBIAR LA CONTRASEÑA

        const saltRounds=16;
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            req.body.password=hash
            await db.query(`UPDATE usuarios SET password = ? WHERE idusuario = ?`, [req.body.password,req.body.idusuario], function(err:any, result:any, fields:any){
                if(err) throw err
                res.json(result)
            });
        });
    }
}

const loginController = new LoginController()
export default loginController