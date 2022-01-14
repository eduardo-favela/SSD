"use strict";
/* DRIVER=Firebird/InterBase(r) driver;
 UID=SYSDBA;
  PWD=masterkey;
 DBNAME=" 10.1.1.12:f:\Microsip datos\KSNACKS.FDB ";
CLIENT=C:\Program Files (x86)\Microsip\2019\fbclient.dll */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    host: '10.1.1.12',
    port: 3050,
    database: 'f:/Microsip datos/KSNACKS.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    retryConnectionInterval: 1000,
};
