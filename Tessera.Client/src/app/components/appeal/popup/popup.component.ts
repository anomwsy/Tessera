import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AppealService } from '../AppealService/appeal.service';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../../../shared/services/AppService/app.service';
import { WebsocketService } from '../../../shared/websocket/websocket.service';

type TicketInfo = {
  id: number;
  subject: string;
  description: string;
};
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent implements OnInit {
  @Input() positionX: number = 0;
  @Input() positionY: number = 0;
  @Input() role: string | undefined = '';
  @Input() selectedAppeal: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  @Output() closePopupEvent = new EventEmitter();
  @Output() rejectAppealEvent = new EventEmitter();
  @Output() createTicketEvent = new EventEmitter<TicketInfo>();
  data: any = {};
  isOpen: boolean = false;
  buttonActive: boolean = true;
  isLoading: boolean = false;

  constructor(
    private appealService: AppealService,
    private appService: AppService,
    private webSocketService: WebsocketService,
    private elRef: ElementRef
  ) {}
  ngOnInit(): void {
    this.selectedAppeal.subscribe({
      next: (data) => {
        this.buttonActive = true;
        this.isLoading = true;
        if (data !== null) {
          this.appealService.GetAppeal(data.id).subscribe({
            next: (result) => {
              this.isLoading = false;
              this.data = result;
              this.buttonActive = result.status;
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      },
    });
  }
  rejectAppeal() {
    this.appealService.rejectAppeal(this.data.id).subscribe({
      next: (result) => {
        console.log(result);
        const id: string = this.data.id;
        console.log('id', id);
        this.sendMessage('appeal', `${id}`);
        this.ClosePopupWithFetchApi();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  sendMessage(type: string, message: string): void {
    const messageData = {
      type: type,
      sender: this.appService.username,
      message: message,
      recipientType: 'Role',
      recipient: '',
    };
    this.webSocketService.sendMessage(messageData);
  }
  closePopup() {
    this.closePopupEvent.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.isOpen) {
      this.isOpen = true;
    } else if (!this.elRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  ClosePopupWithFetchApi() {
    this.rejectAppealEvent.emit();
  }

  createTicket() {
    this.createTicketEvent.emit({
      id: this.data.id,
      subject: this.data.subject,
      description: this.data.description,
    });
  }
}
