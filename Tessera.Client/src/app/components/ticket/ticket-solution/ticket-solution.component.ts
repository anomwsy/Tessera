import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../shared/services/AppService/app.service';
import { AppealService } from '../../appeal/AppealService/appeal.service';
import { TicketService } from '../TIcketService/ticket.service';
import { WebsocketService } from '../../../shared/websocket/websocket.service';

@Component({
  selector: 'app-ticket-solution',
  templateUrl: './ticket-solution.component.html',
  styleUrl: './ticket-solution.component.scss'
})
export class TicketSolutionComponent {
  isLoading: boolean = false;
  createTicketForm!: FormGroup;
  @Input() status: boolean | null= null;
  @Input() selectedTicket: any;
  @Input() popupVisible: boolean = false;
  isOpen: boolean = false;
  @Output() cancelTicketEvent = new EventEmitter();
  @Output() doneCreateSolutionEvent = new EventEmitter();
  @Output() changeStatusEvent = new EventEmitter<boolean | null>();

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private appealService: AppealService,
    private ticketService: TicketService,
    private webSocketService: WebsocketService

  ) {
  }

  ngOnInit(): void {
    this.createTicketForm = this.createForm();
  }

  cancelCreate() {
    this.cancelTicketEvent.emit();
  }
  changeStatus(status: boolean | null) {
    this.changeStatusEvent.emit(status);
  }
  createForm() {
    return this.formBuilder.group({
      description: [
        '',
        Validators.compose([Validators.required]),
      ],
    });
  }
  doneCreateSolution() {
    this.doneCreateSolutionEvent.emit();
  }
  onSubmit() {
    this.createTicketForm.markAllAsTouched();
    if (this.createTicketForm.valid) {
      const value = this.createTicketForm.getRawValue();
      let data = {...value, id: this.selectedTicket.id, status: this.status};
      console.log(data);
      this.ticketService.createSolution(data).subscribe({
        next: (data) => {
          console.log(data);
          this.sendMessage('newTicket', `${this.selectedTicket.id}` , 'AllReportsTo', `${this.appService.reportsTo}`);
          this.doneCreateSolution();
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
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
}
