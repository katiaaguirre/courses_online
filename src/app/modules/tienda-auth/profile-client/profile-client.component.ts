import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { TiendaAuthService } from '../service/tienda-auth.service';

declare function alertSuccess([]):any;
declare function alertDanger([]):any;
@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {
  nav_option:number = 1;
  enrolled_course_count:number = 0;
  active_course_count:number = 0;
  completed_course_count:number = 0;
  user:any = null;
  enrolled_courses:any = [];
  active_courses:any = [];
  completed_courses:any = [];

  sale_details:any = [];
  SaleDSelected:any = null;
  message:any = null;
  rating:number = 0;
  sales:any = [];
  SaleSelected:any = null;

  name:any = null;
  surname:any = null;
  email:any = null;
  phone:any = null;
  profesion:any = null;
  description:any = null;
  password:any = null;
  new_password:any = null;
  file_image:any = null;
  constructor(public authService:AuthService,  public tiendaAuth:TiendaAuthService){}
  ngOnInit(): void{
    this.tiendaAuth.profileClient().subscribe((resp:any) => {
      console.log();
      this.enrolled_course_count = resp.enrolled_course_count;
      this.active_course_count = resp.active_course_count;
      this.completed_course_count = resp.completed_course_count;
      this.user = resp.user;
      this.name = resp.user.name;
      this.surname = resp.user.surname;
      this.email = resp.user.email;
      this.phone = resp.user.phone;
      this.profesion = resp.user.profesion;
      this.description = resp.user.description;
      this.password = resp.user.password;
      this.new_password = resp.user.new_password;
      this.enrolled_courses = resp.enrolled_courses;
      this.active_courses = resp.active_courses;
      this.completed_courses = resp.completed_courses;
      this.sale_details = resp.sale_details;
      this.sales = resp.sales.data;
    })
  }
  navOption(val:number){
    this.nav_option = val;
  }

  logout(){
    this.authService.logout();
  }

  backToList(){
    this.SaleDSelected = null;
    this.rating = 0;
    this.message = null;
  }

  openReview(SaleD:any){
    this.SaleDSelected = SaleD;
    if(this.SaleDSelected.review){
      this.rating = this.SaleDSelected.review.rating;
      this.message = this.SaleDSelected.review.message;
    }
  }

  selectRating(rating:number){
    this.rating = rating;
  }

  saveReview(){
    if(!this.message || !this.rating){
      alertDanger("LA CALIFICACIÓN Y EL MENSAJE SON OBLIGATORIOS")
      return;
    }
    let data = {
      course_id: this.SaleDSelected.course.id,
      sales_details_id: this.SaleDSelected.id,
      message: this.message,
      rating: this.rating,
    };
    if(this.SaleDSelected.review){
      this.tiendaAuth.updateReview(data,this.SaleDSelected.review.id).subscribe((resp:any) => {
        console.log(resp);
        alertSuccess("LA RESEÑA SE ACTUALIZÓ CORRECTAMENTE");
        let INDEX = this.sale_details.findIndex((item:any) => item.id == this.SaleDSelected.id);
        if(INDEX != -1){
          this.sale_details[INDEX].review = resp.review;
        }
      });
    }else{
      this.tiendaAuth.registerReview(data).subscribe((resp:any) => {
        console.log(resp);
        alertSuccess("LA RESEÑA SE REGISTRÓ CORRECTAMENTE");
        let INDEX = this.sale_details.findIndex((item:any) => item.id == this.SaleDSelected.id);
        if(INDEX != -1){
          this.sale_details[INDEX].review = resp.review;
        }
      });
    }
  }

  selectedSale(sale:any){
    this.SaleSelected = sale;
  }

  getCampaign(type:number){
    let Name = "";
    switch(type){
      case 1:
        Name = "CAMPAÑA NORMAL";
        break;
      case 2:
        Name = "CAMPAÑA FLASH";
        break;
      case 3:
        Name = "CAMPAÑA BANNER";
        break;

      default:
      break;
    }
    return Name;
  }

  updateUser(){
    if(this.password || this.new_password){
      if(this.password != this.new_password){
        alertDanger("LAS CONTRASEÑAS NO SON IGUALES")
        return;
      }
    }
    let formData = new FormData();
    if(this.file_image){
      formData.append("UImage",this.file_image);
    }
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("phone",this.phone);
    formData.append("profesion",this.profesion);
    formData.append("description",this.description);
    if(this.new_password){
      formData.append("new_password",this.new_password);
    }
    this.tiendaAuth.updateUser(formData).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess("LOS DATOS SE ACTUALIZARON CORRECTAMENTE")
    })
  }

  processFile($event:any){
    this.file_image = $event.target.files[0];
  }
}
