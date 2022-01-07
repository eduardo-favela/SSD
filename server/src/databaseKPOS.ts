//import sql  from 'mssql'
const sql = require('mssql')
import keys from './keysKPOS'

/* const {keys}=require('./keys') */


const pool = new sql.ConnectionPool(keys.database)

const poolconnected = pool.connect().then((
    (poolconnected:any)=>{
        console.log('KPOS DB is connected')
    }
))
export default pool;
