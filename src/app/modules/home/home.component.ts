import { Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';

declare var $:any ;
declare function HOMEINIT([]):any;
declare function banner_home():any;
declare function countdownT():any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  CATEGORIES:any = [];
  COURSES_HOME:any = [];
  group_category_courses:any = [];
  DISCOUNT_BANNER:any = null;
  DISCOUNT_BANNER_COURSES:any = [];
  DISCOUNT_FLASH:any = null;
  DISCOUNT_FLASH_COURSES:any = [];
  
  constructor(public homeService:HomeService){
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }

  ngOnInit(): void{
    this.homeService.home().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.COURSES_HOME = resp.courses_home.data;
      this.group_category_courses = resp.group_category_courses;
      this.DISCOUNT_BANNER = resp.DISCOUNT_BANNER;
      this.DISCOUNT_BANNER_COURSES = resp.DISCOUNT_BANNER_COURSES;
      this.DISCOUNT_FLASH = resp.DISCOUNT_FLASH;
      this.DISCOUNT_FLASH_COURSES = resp.DISCOUNT_FLASH_COURSES;

      setTimeout(() => {
        banner_home();
        countdownT();
      }, 50)
    })
  }

  getNewTotal(COURSE:any, DISCOUNT_BANNER:any){
    if(DISCOUNT_BANNER.type_discount == 1){
      return COURSE.precio_mxn - COURSE.precio_mxn*(DISCOUNT_BANNER.discount*0.01);
    }else{
      return COURSE.precio_mxn - DISCOUNT_BANNER.discount;
    }
  }

  getTotalPriceCourse(COURSE:any){
    if(COURSE.discount_g){
      return this.getNewTotal(COURSE,COURSE.discount_g);
    }
    return COURSE.precio_mxn;
  }
}
