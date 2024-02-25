import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  constructor() { }
  logoUrl = './assets/image/gold-logo.png';
  isOpenedNav : boolean = true;
  setOpenedNav(){
    this.isOpenedNav = !this.isOpenedNav
  }
}
