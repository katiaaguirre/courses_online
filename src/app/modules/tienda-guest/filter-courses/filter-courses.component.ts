import { Component } from '@angular/core';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { CartService } from '../service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any;
declare function showMoreBtn():any;
declare function alertWarning([]):any;
declare function alertDanger([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-filter-courses',
  templateUrl: './filter-courses.component.html',
  styleUrls: ['./filter-courses.component.css']
})
export class FilterCoursesComponent {
  CATEGORIES:any = [];
  LEVELS:any = [];
  IDIOMAS:any = [];
  selected_option:number = 1;
  selected_grid:number = 1;

  selected_categories:any = [];
  selected_idiomas:any = [];
  selected_levels:any = [];
  selected_rating:number = 0;
  search:any = null;
  LISTCOURSES:any = [];
  user:any = null;
  min_price:number = 0;
  max_price:number = 0;

  constructor(public tiendaGuestService:TiendaGuestService, public cartService:CartService,
    public router:Router, public activated:ActivatedRoute){}

  ngOnInit():void{
    this.user = this.tiendaGuestService.authService.user;

    this.tiendaGuestService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.LEVELS = resp.levels;
      this.IDIOMAS = resp.idiomas;
      
      
      setTimeout(() => {
        showMoreBtn();
      },50)
    })

    this.activated.queryParams.subscribe((resp:any) => {
      console.log(resp);
      this.search = resp.search;
      this.listCourses(); 
    })
  }

  addMode(value:number){
    this.selected_option = value;
  }

  addOption(value:number){
    this.selected_grid = value;
    if(value == 2){
      setTimeout(() => {
        $('#slider-range').slider({
          range: true,
          min: 500,
          max: 6000,
          values: [500, 6000],
          slide: (event:any, ui:any) => {
              $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
              this.min_price = ui.values[0];
              this.max_price = ui.values[1];
          }, stop: () => {
            this.listCourses();
          }
      });
      $('#amount').val('$' + $('#slider-range').slider('values', 0) +
          " - $" + $('#slider-range').slider('values', 1));
      },50);
    }
  }

  listCourses(){
    console.log(this.search);
    let data = {
      search: this.search,
      selected_categories: this.selected_categories,
      min_price: this.min_price,
      max_price: this.max_price,
      selected_idiomas: this.selected_idiomas,
      selected_levels: this.selected_levels,
      selected_rating: this.selected_rating
    }
    this.tiendaGuestService.listCourses(data).subscribe((resp:any) => {
      console.log(resp);
      this.LISTCOURSES = resp.courses.data;
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

  addCategory(ID_CATEGORY:any){
    let INDEX = this.selected_categories.findIndex((item:any) => ID_CATEGORY == item);
    if(INDEX != -1){
      this.selected_categories.splice(INDEX,1);
    }else{
      this.selected_categories.push(ID_CATEGORY)
    }
    this.listCourses();
  }

  addIdioma(IDIOMA:any){
    let INDEX = this.selected_idiomas.findIndex((item:any) => IDIOMA == item);
    if(INDEX != -1){
      this.selected_idiomas.splice(INDEX,1);
    }else{
      this.selected_idiomas.push(IDIOMA)
    }
    this.listCourses();
  }

  addLevel(LEVEL:any){
    let INDEX = this.selected_levels.findIndex((item:any) => LEVEL == item);
    if(INDEX != -1){
      this.selected_levels.splice(INDEX,1);
    }else{
      this.selected_levels.push(LEVEL)
    }
    this.listCourses();
  }

  selectedRating(value:number){
    this.selected_rating = value;
    this.listCourses();
  }

}
