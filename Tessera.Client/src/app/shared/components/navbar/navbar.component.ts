import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { AppService } from '../../services/AppService/app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() role: string | undefined;
  @Input() isOpenedNav: boolean | undefined;
  @Output() openNav = new EventEmitter<boolean>();
  employee: boolean | undefined = true;
  appeal: boolean | undefined = false;
  ticket: boolean | undefined = false;
  history: boolean | undefined = false;
  constructor(private appService: AppService) {
    this.appService.notification.subscribe({
      next: (message) => {
        this.employee = message.get('employee');
        this.appeal = message.get('appeal');
        this.ticket = message.get('ticket');
        this.history = message.get('history');
      },
    });
  }
  setIsOpenedNav() {
    this.openNav.emit();
  }

  openMenu(menu : string) {
    const current = location.pathname.substring(1);
    this.appService.resetNotification(current);
    this.appService.resetNotification(menu);
  }
}
