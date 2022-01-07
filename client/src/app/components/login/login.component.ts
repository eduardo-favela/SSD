import { Component, OnInit } from '@angular/core';
import { LoginservicesService } from 'src/app/services/loginservices.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginServicesService:LoginservicesService, private location:Location, private router:Router) { }

  usuario = {
    idusuario : null,
    password : null
  }
  isDisabled:boolean=true
  loaderhidden:boolean=true
  btnDisabled:boolean=false
  public sessionStorage=sessionStorage

  ngOnInit(): void {
    if(this.sessionStorage.getItem('userid')){
      this.redirectToHome()
    }
  }

  login(){
    this.loaderhidden=false
    this.btnDisabled=true
    this.isDisabled=true
    if(this.usuario.idusuario && this.usuario.password){
      this.loginServicesService.login(this.usuario).subscribe(
        res=>{
          console.log(res)
          if(res){
            this.btnDisabled=false
            this.loaderhidden=true
            sessionStorage.setItem('userid',this.usuario.idusuario)
            this.isDisabled=true
            this.redirectToHome()
          }
          else{
            this.btnDisabled=false
            this.loaderhidden=true
            this.isDisabled=false
          }
        },
        err=>console.error(err)
      )
    }
    else{
      this.btnDisabled=false
      this.loaderhidden=true
      this.isDisabled=false
    }
  }
  redirectToHome(){
    this.location.replaceState('/');
    this.router.navigate(['/'])
  }
}
