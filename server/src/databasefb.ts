import Firebird from 'node-firebird'
import options from './keysfirebird'

const pool = Firebird.pool(25,options);

export default pool