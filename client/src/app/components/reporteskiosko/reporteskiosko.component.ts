import { Component, OnInit } from '@angular/core';
import { ComprasService } from 'src/app/services/compras.service';
import * as moment from 'moment'

@Component({
  selector: 'app-reporteskiosko',
  templateUrl: './reporteskiosko.component.html',
  styleUrls: ['./reporteskiosko.component.css']
})
export class ReporteskioskoComponent implements OnInit {

  constructor(private comprasService : ComprasService) { }

  almacenes : any = []
  almacenSelected : any = 0
  productos : any

  productsok : any = []
  productswarning : any = []
  productsalert : any = []

  loaderhidden=true
  selectdisabled=false
  cardshidden = false

  ngOnInit(): void {
    this.getAlmacenes()
  }

  getAlmacenes(){
    this.comprasService.getalmacenes().subscribe(
      res=>{
        this.almacenes = res
      },
      err=>{
        console.log('ocurrio un error al obtener los almacenes')
      }
    )
  }

  getproductos(){

    this.loaderhidden=false
    this.selectdisabled=true
    this.cardshidden=true

    let prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);

    let prevMondayAux = new Date(prevMonday);
    prevMondayAux.setDate(prevMonday.getDate()-2)

    let prevSunday = new Date(prevMondayAux);
    prevSunday.setDate(prevSunday.getDate() - (prevSunday.getDay()) % 7);

    this.comprasService.getproductosDI({almacen:this.almacenSelected,fechaini:moment(prevSunday).format('YYYY-MM-DD'), fechafin:moment(prevMonday).format('YYYY-MM-DD')}).subscribe(
      res=>{
        this.productos = res
        this.productsalert = this.productos.productsalert
        this.productswarning = this.productos.productswarning
        this.productsok = this.productos.productsok
        this.loaderhidden=true
        this.selectdisabled=false
        this.cardshidden=false
      },
      err=>{

      }
    );
  }
}
