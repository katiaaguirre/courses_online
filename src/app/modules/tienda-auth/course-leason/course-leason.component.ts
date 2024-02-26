import { Component } from '@angular/core';
import { TiendaAuthService } from '../service/tienda-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare function alertDanger([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-course-leason',
  templateUrl: './course-leason.component.html',
  styleUrls: ['./course-leason.component.css']
})
export class CourseLeasonComponent {
  slug:any = null;
  selected_course:any = null;
  selected_clase:any = null;
  constructor(public tiendaAuthService:TiendaAuthService,public activatedRoute:ActivatedRoute,
    public router:Router,public Sanitizer:DomSanitizer){}

  ngOnInit():void{
    this.activatedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.slug = resp.slug;
    })

    this.tiendaAuthService.showCourse(this.slug).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
        this.router.navigateByUrl("/");
      }
      this.selected_course = resp.course;

      this.selected_clase = this.selected_course.malla[0].clases[0];
    })
  }

  urlVideo(selected_clase:any){
    return this.Sanitizer.bypassSecurityTrustResourceUrl(selected_clase.url_video)
  }

  openClase(clase:any){
    this.selected_clase = clase;
  }
}
