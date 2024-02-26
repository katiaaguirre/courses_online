import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TiendaGuestService {

  constructor(public http:HttpClient, public authService: AuthService) { }

  landingCourse(slug:string, campaign_discount:any = null){
    let headers = new HttpHeaders({"Authorization": "Bearer "+this.authService.token});
    let LINK = "";
    if(campaign_discount){
      LINK = LINK + "?campaign_discount="+campaign_discount;
    }
    let URL = URL_SERVICIOS+"/ecommerce/course_details/"+slug+LINK;
    return this.http.get(URL,{headers: headers});
  }

  listCourses(data:any){
    let URL = URL_SERVICIOS+"/ecommerce/list_courses/";
    return this.http.post(URL,data);
  }

  listConfig(){
    let URL = URL_SERVICIOS+"/ecommerce/config_all/";
    return this.http.get(URL);
  }
}
