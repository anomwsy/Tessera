import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../shared/services/AppService/app.service';
import { AppealService } from './AppealService/appeal.service';
import { WebsocketService } from '../../shared/websocket/websocket.service';
import { BehaviorSubject } from 'rxjs';

type TicketInfo = {
  id: number;
  subject: string;
  description: string;
};
@Component({
  selector: 'app-appeal',
  templateUrl: './appeal.component.html',
  styleUrl: './appeal.component.scss',
})
export class AppealComponent implements OnInit {
  title = 'Appeal';
  data: any[] = [];
  waitingData: any[] = [];
  reportsTo: string | null = null;
  search: string = '';
  column: string = '';
  sort: boolean | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  isLoading: boolean = false;
  selectedAppeal: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  popupVisible: boolean = false;
  positionX: number = 0;
  positionY: number = 0;
  createTicketVisible: boolean = false;
  windowWidth: number = window.innerWidth;
  selectedData: any = null;
  role : string | undefined= ''
  ticketInfo: TicketInfo | null = null;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appealService: AppealService,
    private appService: AppService,
    private webSocketService: WebsocketService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    document.title = 'Tessera - ' + this.title;
    if(this.appService.role !== 'Admin'){
      this.router.navigate(['/NotFound'])
    }
    this.reportsTo = this.appService.reportsTo;
    this.role = this.appService.role;
    this.getAllAppeals();
    this.appService.newUpdate.subscribe({
      next: (message) => {
        if (location.pathname == '/appeal') {
          if (message.get('appeal') === `${this.selectedData?.id}` && message.get('appeal') !== false) {
            console.log('updated');
            this.createTicketVisible = false;
            this.selectedData = null;
            this.popupVisible = false;
            this.selectedAppeal.next(null);
            this.getAllAppealsWithoutLoading();
          }
          else if (message.get('appeal') !== false){
            console.log('updated');
            this.getAllAppealsWithoutLoading();
          }
        }
      },
    });
  }
  getAllAppeals() {
    this.isLoading = true;
    this.appealService
      .getAllAppeals(
        this.reportsTo,
        this.search,
        this.column,
        this.sort,
        this.page,
        this.pageSize
      )
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          this.data = result.data.filter(
            (x: { status: boolean }) => x.status === true
          );
          this.waitingData = result.data.filter(
            (x: { status: boolean }) => x.status === false
          );
          this.search = result.search ?? '';
          this.column = result.column ?? '';
          this.sort = result.sort ?? null;
          this.page = result.page;
          this.totalPage = result.totalPage;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getAllAppealsWithoutLoading() {
    this.appealService
    .getAllAppeals(
      this.reportsTo,
      this.search,
      this.column,
      this.sort,
      this.page,
      this.pageSize
    )
    .subscribe({
      next: (result) => {
        console.log('withoutLoading',result);
        this.data = result.data.filter(
          (x: { status: boolean }) => x.status === true
        );
        this.waitingData = result.data.filter(
          (x: { status: boolean }) => x.status === false
        );
        this.search = result.search ?? '';
        this.column = result.column ?? '';
        this.sort = result.sort ?? null;
        this.page = result.page;
        this.totalPage = result.totalPage;
      },
      error: (error) => {
        console.log(error);
      },
    });
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

  selectAppeal(data: any, event: MouseEvent) {
    this.popupVisible = true;
    this.positionX = event.clientX;
    this.positionY = event.clientY;
    if (this.windowWidth - this.positionX < 400) {
      // Jika mendekati batas kanan, atur posisi ke sisi kiri mouse
      this.positionX -= 400;
    }
    if (this.selectedData?.id === data.id) {
      this.selectedData = null;
      this.popupVisible = false;
      this.selectedAppeal.next(null);
      return;
    }
    this.selectedAppeal.next(data);
    this.selectedData = data;
  }

  closePopup() {
    this.popupVisible = false;
    this.selectedData = null;
    this.selectedAppeal.next(null);
  }

  rejectAppeal() {
    const id = this.selectedData.id;
    this.popupVisible = false;
    this.selectedAppeal.next(null);
    this.selectedData = null;
    this.getAllAppealsWithoutLoading();
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

  toPage(page: number) {
    this.page = page;
    this.popupVisible = false;
    this.selectedData = null;
    this.selectedAppeal.next(null);
    this.getAllAppealsWithoutLoading();
  }

  sortColumn(column: string) {
    this.popupVisible = false;
    this.selectedData = null;
    this.selectedAppeal.next(null);
    this.column = column;
    if (this.sort === null) {
      this.sort = true;
    } else {
      this.sort = !this.sort;
    }
    this.getAllAppealsWithoutLoading();
  }

  searchAppeal() {
    this.popupVisible = false;
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.getAllAppealsWithoutLoading();
  }

  onMouseMove(event: MouseEvent): void {
    this.positionX = event.clientX;
    this.positionY = event.clientY;
  }

  onMouseEnter(event: MouseEvent): void {
    this.popupVisible = !this.popupVisible;
    this.positionX = event.clientX;
    this.positionY = event.clientY;
  }

  createTicket($event: TicketInfo) {
    this.createTicketVisible = true;
    this.popupVisible = false;
    this.ticketInfo = $event;
  }

  cancelCreateTicket() {
    this.createTicketVisible = false;
    this.selectedData = null;
    this.popupVisible = false;
    this.selectedAppeal.next(null);
  }
  doneCreateTicket(appointedTo : string) {
    const id = this.selectedData.id;
    this.createTicketVisible = false;
    this.selectedData = null;
    this.popupVisible = false;
    this.selectedAppeal.next(null);
    this.sendMessage('appeal', `${id}`, 'Role', ``);
    this.sendMessage('newTicket', ``, 'ReportsTo', `${this.appService.reportsTo}`);
    this.sendMessage('newTicket', ``, 'TechSupport', `${appointedTo}`);
    this.getAllAppealsWithoutLoading();
  }
}
