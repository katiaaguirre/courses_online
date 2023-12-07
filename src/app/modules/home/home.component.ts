import { Component } from '@angular/core';

declare var $: any;
declare function HOMEINIT([]): any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor() {
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }
}
