import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { CartService } from '../service/cart.service';

declare function courseView():any;
declare function showMoreBtn():any;
declare function magnigyPopup():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CoursesDetailsComponent implements OnInit{
  constructor(public activatedRoute: ActivatedRoute, public tiendaGuestService:TiendaGuestService,
    public cartService:CartService, public router:Router){}
  SLUG:any = null;
  LANDING_COURSE:any = null;
  courses_related_instructor:any = [];
  courses_related_categories:any = [];
  reviews:any = [];
  campaign_discount_id:any;
  DISCOUNT:any = null;
  user:any = null;

  has_course:any = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.SLUG = resp.slug;
    });
    this.activatedRoute.queryParams.subscribe((resp:any) => {
      console.log(resp);
      this.campaign_discount_id = resp.campaign_discount;
    });
    this.tiendaGuestService.landingCourse(this.SLUG,this.campaign_discount_id).subscribe((resp:any) => {
      console.log(resp);
      this.LANDING_COURSE = resp.course;
      this.courses_related_instructor = resp.courses_related_instructor;
      this.courses_related_categories = resp.courses_related_categories;
      this.reviews = resp.reviews
      this.DISCOUNT = resp.DISCOUNT;
      if(this.DISCOUNT){
        this.LANDING_COURSE.discount_g = resp.DISCOUNT;
      }
      setTimeout(() => {
        magnigyPopup();
      }, 50);
      this.has_course = resp.has_course;
    })
    setTimeout(() => {
      courseView();
      showMoreBtn();
    }, 50)
    this.user = this.cartService.authService.user;
  }

  getNewTotal(COURSE:any, campaign_discount:any){
    if(campaign_discount.type_discount == 1){
      return COURSE.precio_mxn - COURSE.precio_mxn*(campaign_discount.discount*0.01);
    }else{
      return COURSE.precio_mxn - campaign_discount.discount;
    }
  }

  getTotalPriceCourse(COURSE:any){
    if(COURSE.discount_g){
      return this.getNewTotal(COURSE,COURSE.discount_g);
    }
    return COURSE.precio_mxn;
  }

  addCart(){
    if(!this.user){
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    let data = {
      course_id: this.LANDING_COURSE.id,
      type_discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.type_discount : null,
      discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.discount : null,
      type_campaign: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.type_campaign : null,
      coupon_code: null,
      discount_code: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.code : null,
      precio_unitario: this.LANDING_COURSE.precio_mxn,
      total: this.getTotalPriceCourse(this.LANDING_COURSE),
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
