import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http: HttpClient) { }

  getinventario(params){
    return this.http.post(`${API_URI}/compras/getinventario`,params)
  }

  getinventarioant(params){
    return this.http.post(`${API_URI}/compras/getinventarioant`,params)
  }

  getProducts(){
    return this.http.get(`${API_URI}/compras/getproducts`)
  }

  setinventario(params){
    return this.http.post(`${API_URI}/compras/setinvent`,params)
  }

  setinventariodet(params){
    return this.http.post(`${API_URI}/compras/setinventdet`,params)
  }

  updateinventario(params){
    return this.http.post(`${API_URI}/compras/updateinvent`,params)
  }

  getalmacenes(){
    return this.http.get(`${API_URI}/compras/getalmacenes`)
  }

  getproductosDI(params){
    return this.http.post(`${API_URI}/compras/getproductosDI`,params)
  }
}
