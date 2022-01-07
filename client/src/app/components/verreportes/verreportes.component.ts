import { nullSafeIsEquivalent, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as FileSaver from 'file-saver'

import { CentroscostosService } from 'src/app/services/centroscostos.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-verreportes',
  templateUrl: './verreportes.component.html',
  styleUrls: ['./verreportes.component.css']
})
export class VerreportesComponent implements OnInit {

  constructor(private centrosCostosService:CentroscostosService,private reportesService:ReportesService) { }

  ngOnInit(): void {
    this.getSucursales()
    this.getEstatus()
  }
  
  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////
  sucursales=null
  estatus=null
  estatusnuevo=null
  commentsnew=null
  folioreporte=null
  responsereportes : any = []
  reportes : any = []
  noInfo=true
  fecha1=null
  fecha2=null
  sucursal=null
  estatusrep=null
  idReporte=null
  detallesreporte : any = []
  sessionStorage=sessionStorage
  ///////////////////////////////////VARIABLES Y PROPIEDADES GLOBALES DE LA CLASE///////////////////////////////////

  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////

  getSucursales(){
    this.centrosCostosService.getsucursales().subscribe(
      res=>{
        this.sucursales=res
      },
      err=>{
      }
    )
  }

  getEstatus(){
    this.reportesService.getestatus().subscribe(
      res=>{
        this.estatus=res
      },
      err=>{
        alert("ocurrió un error al obtener los estatus")
      }
    )
  }

  buscaReporteFolio(){    
    if(this.folioreporte){
      this.reportesService.getreportefolio({folio:this.folioreporte}).subscribe(
        res=>{
          this.clearInputs()
          this.responsereportes=res
          if(this.responsereportes.length>0){
            this.reportes=this.responsereportes
            this.noInfo=false
            $('#folioreporte').val('')
          }
          else{
            this.noInfo=true
            this.folioreporte=null
            $('#noreportemodal').modal('show')
          }
        },
        err=>{
          alert("Ocurrió un error con la consulta")
        }
      )
    }
    else{
      alert("Debe proporcionar el folio del reporte que desea buscar")
    }
  }

  buscaReportes(){
    if(this.fecha1&&this.fecha2&&this.sucursal&&this.estatusrep){
      this.folioreporte=null
      let sucursal, estatusrep
      sucursal=(this.sucursal=="Todos"?(this.sucursales.map(a => a.estado)):(this.sucursal))
      estatusrep=(this.estatusrep=="Todos"?(this.estatus.map(a => a.idestatus)):(this.estatusrep))
      this.reportesService.getreportesvending({fecha1:this.fecha1,fecha2:this.fecha2,sucursal:sucursal,estatus:estatusrep}).subscribe(
        res=>{
          this.responsereportes=res
          if(this.responsereportes.length>0){
            this.reportes=this.responsereportes
            this.noInfo=false
          }
          else{
            this.noInfo=true
            $('#noreportemodal').modal('show')
          }
        },
        err=>{
  
        }
      )
    }
    else{
      alert("Se deben llenar todos los campos pra la búsqueda (fechas, sucursal y estatus)")
    }
  }

  onReporteButtonClick(e){
    this.idReporte = parseInt($(e.srcElement).parent().parent().siblings('th:first').html())
    this.reportesService.getdetallereporte({folioreporte:this.idReporte}).subscribe(
      res=>{
        this.detallesreporte=res
        if(this.detallesreporte.length>0){
          $("#detallereportemodal").modal('show')
        }
        else{
          alert("No se ha encontrado información adicional de este reporte")
        }
      },
      err=>{
        alert("Ocurrió un error al tratar de obtener la información")
      }
    )
  }

  onEditReporteButtonClick(e){
    this.idReporte = parseInt($(e.srcElement).parent().parent().siblings('th:first').html())
    $("#editareportemodal").modal('show')
  }

  guardarCambios(){
    if(!this.estatusnuevo){
      $('#selectstatus').removeClass("is-valid")
      $('#selectstatus').addClass("is-invalid")
    }
    else{
      $('#selectstatus').removeClass("is-invalid")
      $('#selectstatus').addClass("is-valid")

    }
    if(!this.commentsnew){
      $('#inputcomments').removeClass("is-valid")
      $('#inputcomments').addClass("is-invalid")
    }
    else{
      $('#inputcomments').removeClass("is-invalid")
      $('#inputcomments').addClass("is-valid")
    }
    if(this.estatusnuevo && this.commentsnew){
      this.reportesService.registrahistorial({reportevending:this.idReporte,comentarios:this.commentsnew,estatus:this.estatusnuevo}).subscribe(
        res=>{
          this.reportesService.updateReporte({reportevending:this.idReporte,estatus:this.estatusnuevo}).subscribe(
            res=>{
              this.clearInputsEditModal()
              $("#editareportemodal").modal('hide')
              $("#confirmload").modal('show')
            },
            err=>{
              alert("Ocurrió un error")
            }
          )
        },
        err=>{
          alert("Ocurrió un error")
        }
      )
    }
  }

  cancelarCambios(){
    this.clearInputsEditModal()
  }

  downloadExcelFile(){
    let fecha=moment().format('DDMMYYYYhhmmA')
    this.reportesService.downloadexcelfile({reportes:this.reportes,fecha:fecha}).subscribe(
      res=>{
        /* console.log(res) */
        FileSaver.saveAs(res, fecha+".xlsx")
      },
      err=>{
        console.log(err)
      }
    )
  }

  cerrarSesion(){
    sessionStorage.clear()
  }

  clearInputsEditModal(){
    $('#inputcomments').removeClass("is-valid")
    $('#inputcomments').removeClass("is-invalid")
    $('#selectstatus').removeClass("is-valid")
    $('#selectstatus').removeClass("is-invalid")
    this.estatusnuevo=null
    this.commentsnew=null
    this.idReporte=null
  }
  
  clearInputs(){
    this.folioreporte=null
    this.fecha1=null
    this.fecha2=null
    this.sucursal=null
    this.estatusrep=null
    this.reportes=[]
    this.noInfo=true
  }
  ///////////////////////////////////////////////////FUNCIONES//////////////////////////////////////////////////////
}