import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  registraReporte(reporte){
    return this.http.post(`${API_URI}/reportes/registrareporte`,reporte)
  }
  enviarEmail(reporte){
    return this.http.post(`${API_URI}/reportes/enviarEmail`,reporte)
  }
  enviarEmailinterno(reporte){
    return this.http.post(`${API_URI}/reportes/enviarEmailinterno`,reporte)
  }
  registrahistorial(reporte){
    return this.http.post(`${API_URI}/reportes/registrahistorial`,reporte)
  }
  getestatus(){
    return this.http.get(`${API_URI}/reportes/getestatus`)
  }
  getreportefolio(folio){
    return this.http.post(`${API_URI}/reportes/getreportefolio`,folio)
  }
  getreportesvending(filtros){
    return this.http.post(`${API_URI}/reportes/getreportesvending`,filtros)
  }
  getdetallereporte(folio){
    return this.http.post(`${API_URI}/reportes/getdetallereporte`,folio)
  }

  downloadexcelfile(reportes){
    return this.http.post(`${API_URI}/reportes/downloadexcel`,reportes,{responseType:'blob'})
  }

  updateReporte(reporte){
    return this.http.post(`${API_URI}/reportes/updatereporte`,reporte)
  }
}
