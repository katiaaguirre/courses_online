import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaGuestComponent } from './tienda-guest.component';
import { CoursesDetailsComponent } from './course-details/course-details.component';
import { FilterCoursesComponent } from './filter-courses/filter-courses.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaGuestComponent,
    children: [
      {
        path: 'landing-curso/:slug',
        component: CoursesDetailsComponent
      },
      {
        path: 'listado-de-cursos',
        component: FilterCoursesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaGuestRoutingModule { }
