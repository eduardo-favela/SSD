import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import API_URI from './API_URI'

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(private http: HttpClient) { }

  uploadFile(formData) {
    //console.log(formData)
    return this.http.post(`${API_URI}/archivos`, formData);
  }
}
