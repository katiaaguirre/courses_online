import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
{
  path: '',
  loadChildren: () => import("./modules/home/home.module").then(m => m.HomeModule),
},
{
  path: '',
  redirectTo: "/",
  pathMatch: 'full',
},
{
  path: '**',
  redirectTo: 'error/404'
}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule, 
  ]
})
export class AppRoutingModule { }
