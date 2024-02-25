import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';
import { AppService } from '../../services/AppService/app.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private currentLayout: string = 'default';
  constructor(public router: Router, private appService: AppService) {
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLayout();
        this.appService.parseJwt();
      }
    });
  }

  updateLayout() {
    const route = this.router.routerState.snapshot.root.firstChild;
    if (route && route.data) {
      this.currentLayout = route.data['layout'] || 'default';
    } else {
      this.currentLayout = 'default';
    }

  }



  getLayout(): string {
    return this.currentLayout;
  }
}
