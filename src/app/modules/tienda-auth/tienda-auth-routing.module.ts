import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaAuthComponent } from './tienda-auth.component';
import { ListCartComponent } from './list-cart/list-cart.component';
import { ProfileClientComponent } from './profile-client/profile-client.component';
import { CourseLeasonComponent } from './course-leason/course-leason.component';

const routes: Routes = [{
  path: '',
  component: TiendaAuthComponent,
  children: [
    {
    path: 'carrito-de-compra',
    component: ListCartComponent
    },
    {
      path: 'mi-perfil',
      component: ProfileClientComponent
    },
    {
      path: 'mi-curso/:slug',
      component: CourseLeasonComponent
    }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaAuthRoutingModule { }
