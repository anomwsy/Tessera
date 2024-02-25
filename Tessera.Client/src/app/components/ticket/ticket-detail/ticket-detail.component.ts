import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppealService } from '../../appeal/AppealService/appeal.service';
import { AppService } from '../../../shared/services/AppService/app.service';
import { WebsocketService } from '../../../shared/websocket/websocket.service';
import { TicketService } from '../TIcketService/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
})
export class TicketDetailComponent {
  @Input() selectedTicket: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  @Input() popupVisible: boolean = false;
  isOpen: boolean = false;
  @Output() doneCreateSolutionEvent = new EventEmitter();
  @Output() closePopupEvent = new EventEmitter();
  @Output() openResolveEvent = new EventEmitter();
  @Output() changeStatusEvent = new EventEmitter<boolean | null>();
  data: any = {};
  completeButton: boolean = false;
  cancelButton: boolean = false;
  checkButton: boolean = false;
  reviewButtonLoading = false;
  isLoading: boolean = false;
  role: string |undefined;

  constructor(
    private ticketService: TicketService,
    private appService: AppService,
    private webSocketService: WebsocketService,
    private elemRef: ElementRef
  ) {}
  ngOnInit(): void {
    this.role = this.appService.role;
    this.selectedTicket.subscribe({
      next: (data) => {
        this.data = data;
        if(data !== null){
          this.isOpen = false;
        }
      }
    });
    this.getDetailTicket();
  }
  getDetailTicket() {
    this.isLoading = true;
    this.ticketService.getDetailTicket(this.data.id).subscribe({
      next: (data) => {
        console.log(data);
        this.isLoading = false;
        this.data = data;
        if (this.appService.role !== "Manager" && this.data?.workStatus === "InProgress") {
          this.cancelButton = true;
          if(this.appService.role === "TechSupport"){
            this.completeButton = true;
          }
        }
        else if (this.appService.role === "Manager" && this.data?.workStatus !== "InProgress" && this.data?.reviewDate === "Pending") {
          this.checkButton = true;
        }
      },
      error: (error) => {
        console.log(error)
      }

    })
  }
  cancelTIcket() {}
  closePopup() {
    this.closePopupEvent.emit();
  }
  changeStatus(status: boolean | null) {
    this.changeStatusEvent.emit(status);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.isOpen) {
      this.isOpen = true;
    } else {
      if (!this.elemRef.nativeElement.contains(event.target) && this.isOpen) {
        this.changeStatus(null);
        this.closePopup();
      }
    }
  }
  dueDateStyle() {
    if (this.data.dateLine === 'Tomorrow') {
      return {
        color: '#15ff00',
        'font-weight': 'bold'
      };
    }
    else if (this.data.dateLine === 'Today') {
      return {
        color: '#ffae00',
        'font-weight': 'bold'
      }
    }
    else if (!this.data.dateLine.includes('day')) {
      return {
        color: '#ffb5b5',
        'font-weight': 'bold'
      }
    }
    return {};
  }
  urgencyStyle() {
    if (this.data.urgency === 'High') {
      return {
        color: '#ffb5b5',
        'font-weight': 'bold'
      };
    }
    else if (this.data.urgency === 'Medium') {
      return {
        color: '#ffae00',
        'font-weight': 'bold'
      }
    }
    else{
      return {
        color:'#15ff00',
        'font-weight': 'bold'
      }
    }
  }
  completeTicket() {
    this.changeStatusEvent.emit(true);
    this.openResolveEvent.emit();
  }
  cancelTicket() {
    this.changeStatusEvent.emit(false);
    this.openResolveEvent.emit();
  }
  doneReviewSolution(){
    this.doneCreateSolutionEvent.emit()
;  }

  reviewTicket() {
    this.reviewButtonLoading = true;
    const data = {
      id : this.data.id
    }
    this.ticketService.reviewSolution(data).subscribe({
      next: (data) => {
        console.log(data);
        this.sendMessage('ticket', `${data.id}` , 'AllReportsTo', `${this.appService.reportsTo}`);
        this.sendMessage('newHistory', `${data.id}` , 'AllReportsTo', `${this.appService.reportsTo}`);
        this.doneReviewSolution();
      }
    })
  }

  sendMessage(
    type: string,
    message: string,
    recipientType: string,
    recipient: string | null
  ): void {
    const messageData = {
      type: type,
      sender: this.appService.username,
      message: message,
      recipientType: recipientType,
      recipient: recipient,
    };
    this.webSocketService.sendMessage(messageData);
  }

  reviewDateStyle(){
    if(this.data.reviewDate === 'Pending'){
      return {
        color: '#ffb5b5',
        'font-weight': 'bold'
      }
    }
    else{
      return {
        color:'#15ff00',
        'font-weight': 'bold'
      }
    }
  }
}
