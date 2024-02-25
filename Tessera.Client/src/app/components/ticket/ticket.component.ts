import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../../shared/services/AppService/app.service';
import { TicketService } from './TIcketService/ticket.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../../shared/websocket/websocket.service';
type TicketInfo = {
  id: number;
  subject: string;
  description: string;
};
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent {
  title = 'Ticket';
  data: any[] = [];
  search: string = '';
  column: string = '';
  sort: boolean | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  workStatus: string | null = null;
  isLoading: boolean = false;
  popupVisible: boolean = false;
  solutionVisible: boolean = false;
  solutionStatus: boolean | null = null;
  windowWidth: number = window.innerWidth;
  positionX: number = 0;
  positionY: number = 0;
  selectedTicket: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  id: string | undefined;
  reportsTo: string | null = null;
  selectedData: any = null;

  inProgress: number = 0;
  cancelled: number = 0;
  completed: number = 0;

  constructor(
    private router: Router,
    private appService: AppService,
    private ticketService: TicketService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    document.title = 'Tessera - ' + this.title;
    this.id = this.appService.id;
    this.reportsTo = this.appService.reportsTo;
    this.getAllTickets();
    this.appService.newUpdate.subscribe({
      next: (message) => {
        if (location.pathname == '/ticket') {
          console.log(message);
          if (
            message.get('ticket') === `${this.selectedData?.id}` &&
            message.get('ticket') !== false
          ) {
            this.cancelSolution();
            this.getAllTicketsWithoutLoading();
          } else if (message.get('ticket') !== false) {
            console.log('updated');
            this.getAllTicketsWithoutLoading();
          }
        }
      },
    });
  }

  getAllTickets() {
    this.isLoading = true;
    if (
      this.appService.role === 'Admin' ||
      this.appService.role === 'Manager'
    ) {
      this.ticketService
        .getAllTickets(
          this.reportsTo,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.workStatus
        )
        .subscribe({
          next: (result) => {
            console.log(result);
            this.isLoading = false;
            this.data = result.data;
            this.search = result.search ?? '';
            this.column = result.column ?? '';
            this.sort = result.sort ?? null;
            this.page = result.page;
            this.totalPage = result.totalPage;
            this.inProgress = result.inProgress;
            this.cancelled = result.cancelled;
            this.completed = result.completed;
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.ticketService
        .getAllTicketsForTs(
          this.id,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.workStatus
        )
        .subscribe({
          next: (result) => {
            this.isLoading = false;
            this.data = result.data;
            this.search = result.search ?? '';
            this.column = result.column ?? '';
            this.sort = result.sort ?? null;
            this.page = result.page;
            this.totalPage = result.totalPage;
            this.inProgress = result.inProgress;
            this.cancelled = result.cancelled;
            this.completed = result.completed;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
  getAllTicketsWithoutLoading() {
    if (
      this.appService.role === 'Admin' ||
      this.appService.role === 'Manager'
    ) {
      this.ticketService
        .getAllTickets(
          this.reportsTo,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.workStatus
        )
        .subscribe({
          next: (result) => {
            console.log(result);
            this.data = result.data;
            this.search = result.search ?? '';
            this.column = result.column ?? '';
            this.sort = result.sort ?? null;
            this.page = result.page;
            this.totalPage = result.totalPage;
            this.inProgress = result.inProgress;
            this.cancelled = result.cancelled;
            this.completed = result.completed;
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.ticketService
        .getAllTicketsForTs(
          this.id,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.workStatus
        )
        .subscribe({
          next: (result) => {
            this.data = result.data;
            this.search = result.search ?? '';
            this.column = result.column ?? '';
            this.sort = result.sort ?? null;
            this.page = result.page;
            this.totalPage = result.totalPage;
            this.inProgress = result.inProgress;
            this.cancelled = result.cancelled;
            this.completed = result.completed;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
  toPage(page: number) {
    this.page = page;
    this.popupVisible = false;
    this.getAllTicketsWithoutLoading();
  }

  sortColumn(column: string) {
    this.popupVisible = false;
    this.column = column;
    if (this.sort === null) {
      this.sort = true;
    } else {
      this.sort = !this.sort;
    }
    this.getAllTicketsWithoutLoading();
  }

  searchTicket() {
    this.popupVisible = false;
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.getAllTicketsWithoutLoading();
  }

  selectTicket(data: any) {
    if (this.selectedData === data) {
      this.popupVisible = false;
      this.selectedData = null;
      this.selectedTicket.next(null);
      return;
    }
    this.popupVisible = true;
    this.selectedTicket.next(data);
    this.selectedData = data;
  }

  range(): number[] {
    const visiblePages = 3;
    const currentPage = this.page;

    let startPage = Math.max(currentPage - 1, 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > this.totalPage) {
      endPage = this.totalPage;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => index + startPage
    );
  }

  workStatusChange(status: string | null) {
    this.search = '';
    this.popupVisible = false;
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.workStatus = status;
    this.getAllTicketsWithoutLoading();
  }

  closePopup() {
    this.selectedData = null;
    this.popupVisible = false;
    this.solutionVisible = false;
    this.selectedTicket.next(null);
  }
  cancelSolution() {
    this.selectedData = null;
    this.popupVisible = false;
    this.solutionVisible = false;
    this.solutionStatus = null;
    this.selectedTicket.next(null);
  }
  openResolveTicket() {
    this.popupVisible = false;
    this.solutionVisible = true;
  }
  changeStatus(status: boolean | null) {
    this.solutionStatus = status;
  }
  doneCreateSolution() {
    this.cancelSolution();
    this.getAllTicketsWithoutLoading();
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
