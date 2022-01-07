import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class LoginservicesService {

  constructor(private http: HttpClient) { }

  login(userdata){
    return this.http.post(`${API_URI}/login/iniciarsesion`,userdata)
  }
}
