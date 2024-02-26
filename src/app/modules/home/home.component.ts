import { Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { CartService } from '../tienda-guest/service/cart.service';
import { Router } from '@angular/router';

declare var $:any ;
declare function HOMEINIT([]):any;
declare function banner_home():any;
declare function countdownT():any;
declare function alertWarning([]):any;
declare function alertDanger([]):any;
declare function alertSuccess([]):any;
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
  user:any = null;
  
  constructor(public homeService:HomeService, public cartService:CartService,
    public router:Router){
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

    this.user = this.cartService.authService.user;
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

  
  addCart(LANDING_COURSE:any, DISCOUNT_CAMPAIGN:any = null){
    if(!this.user){
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    if(DISCOUNT_CAMPAIGN){
      LANDING_COURSE.discount_g = DISCOUNT_CAMPAIGN;
    }
    let data = {
      course_id: LANDING_COURSE.id,
      type_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_discount : null,
      discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.discount : null,
      type_campaign: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_campaign : null,
      coupon_code: null,
      discount_code: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.code : null,
      precio_unitario: LANDING_COURSE.precio_mxn,
      total: this.getTotalPriceCourse(LANDING_COURSE),
    };
    this.cartService.registerCart(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
        return;
      }else{
        this.cartService.addCart(resp.cart)
        alertSuccess("EL CURSO SE AGREGÓ AL CARRITO");
      }
    })
    
  }
}
