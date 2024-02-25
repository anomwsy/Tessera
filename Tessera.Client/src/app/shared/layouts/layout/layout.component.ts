import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../../services/AppService/app.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  @Input() username: string | undefined = '';
  @Input() role: string | undefined = '';
  constructor(
    private breakpointObserver: BreakpointObserver,
    private appService: AppService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Handset, Breakpoints.Small])
      .subscribe((result) => {
        this.isOpenedNav = !result.matches;
      });
  }
  ngOnInit(): void {

  }

  isOpenedNav: boolean = true;
  setOpenedNav() {
    this.isOpenedNav = !this.isOpenedNav;
  }


}
