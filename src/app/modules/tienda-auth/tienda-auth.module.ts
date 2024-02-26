import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaAuthRoutingModule } from './tienda-auth-routing.module';
import { TiendaAuthComponent } from './tienda-auth.component';
import { ListCartComponent } from './list-cart/list-cart.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileClientComponent } from './profile-client/profile-client.component';
import { CourseLeasonComponent } from './course-leason/course-leason.component';


@NgModule({
  declarations: [
    TiendaAuthComponent,
    ListCartComponent,
    ProfileClientComponent,
    CourseLeasonComponent
  ],
  imports: [
    CommonModule,
    TiendaAuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ]
})
export class TiendaAuthModule { }
