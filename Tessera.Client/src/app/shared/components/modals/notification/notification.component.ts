
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  @Input() isNotifOpen: boolean | undefined;
  @Input() isSuccess: boolean = true;
  @Output() closeNotif = new EventEmitter<boolean>();
  notifOpen = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.notifOpen = true;
      this.setIsNotifOpen();
    }, 1000);
  }
  setNotifOpen() {
    this.isNotifOpen = true;
  }
  setIsNotifOpen() {
    this.closeNotif.emit();
  }
}
