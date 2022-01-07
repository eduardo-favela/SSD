import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {DpDatePickerModule} from 'ng2-date-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Route, RouterModule} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { SidebarModule } from 'ng-sidebar';
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es-MX';
import { ChartsModule } from 'ng2-charts';
import { jqxBulletChartModule }   from 'jqwidgets-ng/jqxbulletchart';
import { NgxGaugeModule }   from 'ngx-gauge';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReporteskioskoComponent } from './components/reporteskiosko/reporteskiosko.component';
import { VerreportesComponent } from './components/verreportes/verreportes.component';
import { LoginComponent } from './components/login/login.component';
import * as $ from "jquery";
import * as bootstrap from "bootstrap";

registerLocaleData(localeEs)


const routes:Route[]=[
  {path:'', component:HomeComponent},
  {path:'reportes', component:ReporteskioskoComponent},
  {path:'vereportes', component:VerreportesComponent},
  {path:'mngreportes', component:LoginComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReporteskioskoComponent,
    VerreportesComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    SidebarModule,
    HttpClientModule,
    FormsModule,
    AutocompleteLibModule,
    DpDatePickerModule,
    ChartsModule,
    jqxBulletChartModule,
    NgxGaugeModule,
    NgbModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
