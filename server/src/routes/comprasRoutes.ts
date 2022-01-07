import { Router } from 'express'
import comprasController  from '../controllers/comprasController'

class ComprasRoutes {
    public router: Router = Router()

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/getalmacenes', comprasController.getalmacenes)
        this.router.get('/getproducts', comprasController.getproducts)
        this.router.post('/getproductosDI', comprasController.getproductosDI)
        this.router.post('/getinventario', comprasController.getinventario)
        this.router.post('/getinventarioant', comprasController.getinventarioant)
        this.router.post('/setinvent', comprasController.setinvent)
        this.router.post('/setinventdet', comprasController.setinventdet)
        this.router.post('/updateinvent', comprasController.updateinvent)
    }
}

const comprasRoutes = new ComprasRoutes()
export default comprasRoutes.router