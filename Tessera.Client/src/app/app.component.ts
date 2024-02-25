import { Component } from '@angular/core';
import { LayoutService } from './shared/layouts/layout/layout.service';
import { AppService } from './shared/services/AppService/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Tessera.Client';
  username: string | undefined;
  role: string | undefined;
  constructor(private layoutService: LayoutService, private appService: AppService) {}

  ngOnInit() {
    this.layoutService.updateLayout();
    this.appService.usernameObservable.subscribe({
      next: (username) => {
        this.username = username;
      }
    })
    this.appService.roleObservable.subscribe({
      next: (role) => {
        this.role = role;
      }
    })
  }

  currentLayout(): string {
    return this.layoutService.getLayout();
  }
}
