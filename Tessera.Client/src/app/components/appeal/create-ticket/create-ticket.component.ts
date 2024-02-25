import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from '../../../shared/services/AppService/app.service';
import { TicketService } from '../../ticket/TIcketService/ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppealService } from '../AppealService/appeal.service';
import { DueDateValidation } from '../../../shared/validations/DueDateValidation';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent implements OnInit {
  isLoading: boolean = false;
  createTicketForm!: FormGroup;
  techSupports: any = [];
  @Input() ticketInfoInput: any;
  @Output() cancelTicketEvent = new EventEmitter();
  @Output() doneCreateTicketEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private appealService: AppealService,
    private ticketService: TicketService
  ) {
    this.getTechSupport();
  }

  ngOnInit(): void {
    this.createTicketForm = this.createForm();
  }

  cancelCreate() {
    this.cancelTicketEvent.emit();
  }

  doneCreateTIcket(appointedTo : string) {
    this.doneCreateTicketEvent.emit(appointedTo);
  }

  createForm() {
    return this.formBuilder.group({
      title: [
        this.ticketInfoInput?.subject,
        Validators.compose([Validators.required]),
      ],
      details: [
        this.ticketInfoInput?.description,
        Validators.compose([Validators.required]),
      ],
      dueDate: [
        '',
        Validators.compose([Validators.required , DueDateValidation(1)]),
      ],
      urgency: ['', Validators.compose([Validators.required])],
      appointedTo: ['', Validators.compose([Validators.required])],
    });
  }

  getTechSupport(): any {
    this.appealService.getTechSupport().subscribe({
      next: (data) => {
        this.techSupports = data;
      },
    });
  }

  onSubmit() {
    this.createTicketForm.markAllAsTouched();
    if (this.createTicketForm.valid) {
      const value = this.createTicketForm.getRawValue();
      let data = {...value, appealId: this.ticketInfoInput.id, createdBy: this.appService.id};
      console.log(data);
      this.appealService.createTicket(data).subscribe({
        next: (result) => {
          this.doneCreateTIcket(data.appointedTo);
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
}
