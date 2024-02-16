import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class TiendaGuestService {

  constructor(public http:HttpClient) { }
  landingCourse(slug:string, campaign_discount:any = null){
    let LINK = "";
    if(campaign_discount){
      LINK = LINK + "?campaign_discount="+campaign_discount;
    }
    let URL = URL_SERVICIOS+"/ecommerce/course_details/"+slug+LINK;
    return this.http.get(URL);
  }
}
