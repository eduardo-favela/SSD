import mysql, { createConnection } from 'mysql'
import keys from './keys'
import {promisify} from 'util'

/* const {keys}=require('./keys') */


const pool : any = mysql.createPool(keys.database)

pool.getConnection((err:any, connection:any)=>{
    if(err) throw err
    connection.release()
    console.log('DB is connected')
})

pool.query = promisify(pool.query)

export default pool