import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as jwt from 'jsonwebtoken';
import { AppService } from '../../services/AppService/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  logoUrl = './assets/image/gold-logo.png';
  @Input() username: string | undefined = '';
  @Input() role: string | undefined = '';
  isAccountOpen: boolean = false;
  @Output() openNav = new EventEmitter<boolean>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private appService : AppService,
    private elemRef: ElementRef
  ) {}
  setIsOpenedNav() {
    this.openNav.emit();
  }

  ngOnInit(): void {}

  logout() {
    this.cookieService.delete('authToken', '/');
    this.router.navigate(['/login']);
    this.appService.resetInformationAccount();
  }

  openAccount() {
    this.isAccountOpen = !this.isAccountOpen;
  }

  closeAccount() {
    this.isAccountOpen = false;
  }



}
