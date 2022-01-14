import { Component, OnInit, ViewChild } from '@angular/core';
import { ComprasService } from 'src/app/services/compras.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private comprasService:ComprasService) { }
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////
  keyword='descripcion'
  placeholder='Buscar una sucursal...'
  puntosventavending : any = []
  placeholderRegion='Seleccionar una sucursal'
  inputsDisabled = false
  @ViewChild('inputRegiones') inputpventas;
  ///////////////////////////////////AUTOCOMPLETES///////////////////////////////////

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////
  tipomaq = null
  plaza = null
  problemascomunes : any = null
  selectDisabled = false
  correo = null
  comentarios = null
  idpventa = ""
  problema = ""
  tiposmaq : any = null
  tiposmaqselect : any = []
  telefono=null
  nomEmp = null
  reporteid = null
  responsereporte : any
  dia : any = null
  hora : any = null

  //////////////////////////////////////////////////////////////////
  sessionStorage=sessionStorage;
  fechaactual : any = new Date(moment().format('YYYY-MM-DD'))
  foliomovinvent=0
  userid : string = 'e.favela@kiosko.com.mx'
  almacenes : any = []
  almacenSelected : any = 0
  inventarioactual : any
  inventarioant: any
  btnaction : string
  /* userid : string = sessionStorage.getItem('userid') */

  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////

  ngOnInit(): void {
    this.fechaactual = moment(this.fechaactual.setDate(this.fechaactual.getDate())).format('YYYY-MM-DD')
    $("#fechainvent").val(this.fechaactual)
    this.cambiafechastabla(this.fechaactual)
    this.getAlmacenes()
  }
////////////////////////////////////////FUNCIONES////////////////////////////////////////

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

  cambiafechastabla(fechaparam) {
    fechaparam = new Date(moment(fechaparam).format('YYYY-MM-DD'))
    let nuevafecha = moment(fechaparam.setDate(fechaparam.getDate() + 1)).format('YYYY-MM-DD')
    let fechaant = moment(fechaparam.setDate(fechaparam.getDate() - 1)).format('YYYY-MM-DD')
    $("#thinventfinalda").html('Inventario final '+ fechaant)
    $("#thinventini").html('Inventario inicial '+nuevafecha)
    $("#thentradas").html('Entradas '+nuevafecha)
    $("#thsalidas").html('Salidas '+nuevafecha)
    $("#thinventfinal").html('Inventario final '+nuevafecha)
  }

  getinventario() {
    this.cambiafechastabla($("#fechainvent").val())
    if(this.almacenSelected){
        $("#spinnerLoader").prop('hidden',false)
        this.comprasService.getinventario({fecha:$("#fechainvent").val(), idalmacen:this.almacenSelected}).subscribe(
          res=>{
            this.inventarioactual=res
            let nuevafecha : any = new Date($("#fechainvent").val().toString())
            nuevafecha = moment(nuevafecha.setDate(nuevafecha.getDate())).format('YYYY-MM-DD')
            this.comprasService.getinventarioant({fecha:nuevafecha, idalmacen:this.almacenSelected}).subscribe(
              res =>{
                this.inventarioant=res

                if (this.inventarioactual.length>0) {
                  if(this.inventarioant.length>0){
                    for (let i = 0; i < this.inventarioant.length; i++) {
                      this.inventarioactual[i].invfinalant=this.inventarioant.find((obj: { codigo: any; }) => {return obj.codigo === this.inventarioactual[i].codigo}).invfinal
                    }
                  }
                  else{
                    for (let j = 0; j < this.inventarioactual.length; j++) {
                      this.inventarioactual[j].invfinalant = 0
                    }
                  }
                  this.filltable({inventario: this.inventarioactual, cinventario:true, folioinvent:this.inventarioactual[0].id_movinventario})
                }
                else{
                  this.comprasService.getProducts().subscribe(
                    res=>{
                      let getProductos : any = res
                      if(this.inventarioant.length>0){
                        for (let i = 0; i < this.inventarioant.length; i++) {
                          getProductos[i].invfinalant=this.inventarioant.find((obj: { codigo: any; }) => {return obj.codigo === getProductos[i].codigo}).invfinal
                        }
                      }
                      else{
                        for (let j = 0; j < getProductos.length; j++) {
                          getProductos[j].invfinalant = 0
                        }
                      }
                      this.filltable({inventario: getProductos, cinventario:false}) 
                    },
                    err=>{

                    }
                  )
                }
              },
              err =>{

              }
            )
          },
          err=>{

          }
        )
    }
    else{
        $('#bodytabla').empty()
        $('#bodytabla').append(`<tr>
                                    <td class="text-center" colspan="8">Seleccione un almacén para consultar el inventario</td>
                                </tr>`)
    }
  }

  filltable(response){
    $("#spinnerLoader").prop('hidden',true)
    if (response.cinventario) {
        this.btnaction='update'
        this.foliomovinvent = response.folioinvent
        let content=''
        $.each(response.inventario, function(i,r){
            content+=`<tr>
                <td>${r.codigo}</td>
                <td>${r.producto}</td>
                <td>${r.unidad_medida}</td>
                <td><input type="number" disabled value = ${(Math.round((r.invfinalant + Number.EPSILON) * 100) / 100)}></td>
                <td><input class="invini" type="number" value=${(Math.round(((!r.invinicial ? r.invfinalant : r.invinicial) + Number.EPSILON) * 100) / 100)}></td>
                <td><input class="invins" type="number" value = ${(Math.round(( r.entradas + Number.EPSILON) * 100) / 100)}></td>
                <td><input class="invouts" type="number" value = ${(Math.round(( r.salidas + Number.EPSILON) * 100) / 100) }></td>
            </tr>`
        });
        $("#bodytabla").empty()
        $("#bodytabla").append(content)
    }
    else{
        this.btnaction='insert'
        let cont=''
        $.each(response.inventario, function(i,r){
            cont+=`<tr>
                <td>${r.codigo}</td>
                <td>${r.producto}</td>
                <td>${r.unidad_medida}</td>
                <td><input type="number" disabled value = ${(Math.round((r.invfinalant + Number.EPSILON) * 100) / 100)}></td>
                <td><input class="invini" type="number" value = ${(Math.round((r.invfinalant + Number.EPSILON) * 100) / 100)}></td>
                <td><input class="invins" type="number"></td>
                <td><input class="invouts" type="number"></td>
            </tr>`
        });
        $("#bodytabla").empty();
        $("#bodytabla").append(cont);
    }
  }

  guardarinfo() {
    $("#guardarcambiosbtn").prop('disabled',true)
    $("#spinnerLoader").prop('hidden',false)
    let inventario = []
    let almacen = $('#exampleFormControlSelect1').val()
    let tableInfo = Array.prototype.map.call(document.querySelectorAll('#tableInv tr'), function(tr){
        return {input : Array.prototype.map.call(tr.querySelectorAll('td input'), function(td){
          return td.valueAsNumber;}),
          text: Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
            return td.innerHTML;})}
        });
    for (let i = 1; i < tableInfo.length; i++) {
        inventario.push({productos_codigo:tableInfo[i].text[0],
           invinicial:(!tableInfo[i].input[1] ? 0 :tableInfo[i].input[1]),
           entradas:(!tableInfo[i].input[2]?0:tableInfo[i].input[2]), 
           salidas:(!tableInfo[i].input[3]?0:tableInfo[i].input[3]),
           invfinal:(((!tableInfo[i].input[1] ? 0 :tableInfo[i].input[1]) + (!tableInfo[i].input[2]?0:tableInfo[i].input[2])) - (!tableInfo[i].input[3]?0:tableInfo[i].input[3]))})
    }
    if (this.btnaction=='insert') {
      this.comprasService.setinventario({invent:{usuarios_idusuario: this.userid, almacenes_idalmacen:almacen, fecha:$("#fechainvent").val()}}).subscribe(
        res=>{
          let insertid : any = res
          this.comprasService.setinventariodet({invent: inventario,folioinvent:insertid.insertId}).subscribe(
            res=>{
              this.loaderEnd()
            },
            err=>{
            }
          )
        },
        err=>{
        }
      )
      /* socket.emit('client:guardarinventario', {inventdet:inventario, invent:{usuarios_idusuario:userid, almacenes_idalmacen:almacen, fecha:$("#fechainvent").val()}}) */
    }
    else{
      this.comprasService.updateinventario({folioinvent : this.foliomovinvent}).subscribe(
          res=>{            
            this.comprasService.setinventariodet({invent:inventario, folioinvent:this.foliomovinvent}).subscribe(
              res=>{
                this.loaderEnd()
              },
              err=>{
              }
            )
          },
          err=>{

          }
        )
      /* socket.emit('client:guardarinventarioupdate', {inventdet:inventario, folioinvent : foliomovinvent, invent:{usuarios_idusuario:userid, almacenes_idalmacen:almacen, fecha:$("#fechainvent").val()}}) */
    }
  }

  loaderEnd(){
    $("#guardarcambiosbtn").prop('disabled',false)
    $("#spinnerLoader").prop('hidden',true)
    $('#modalsuccess').modal('show')
  }
  ////////////////////////////////////////FUNCIONES///////////////////////////////////////

  /////////////////////////////////////AUTOCOMPLETES//////////////////////////////////////

  ////////////////////////////////////AUTOCOMPLETES///////////////////////////////////////
}
