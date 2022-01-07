import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class ProblemasService {

  constructor(private http: HttpClient) { }

  getProblemasVending(){
    return this.http.get(`${API_URI}/problemas/vending`)
  }
}
