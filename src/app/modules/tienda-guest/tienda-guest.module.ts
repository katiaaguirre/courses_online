import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaGuestRoutingModule } from './tienda-guest-routing.module';
import { TiendaGuestComponent } from '../tienda-guest/tienda-guest.component';
import { CoursesDetailsComponent } from './course-details/course-details.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterCoursesComponent } from './filter-courses/filter-courses.component';


@NgModule({
  declarations: [
    TiendaGuestComponent,
    CoursesDetailsComponent,
    FilterCoursesComponent
  ],
  imports: [
    CommonModule,
    TiendaGuestRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ]
})
export class TiendaGuestModule { }
