export default {
    database:{
        database: 'KPOS',
        server: '10.1.1.13',
        authentication: { type: 'default', options: { userName: 'sa', password: '123' } },
        requestTimeout:1500000000,
        connectionTimeout: 1500000000,
        options: {encrypt:false }
    }
}