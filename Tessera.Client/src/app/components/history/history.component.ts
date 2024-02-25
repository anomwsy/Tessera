import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/AppService/app.service';
import { HistoryService } from './HistoryService/history.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  title = 'History';
  data: any[] = [];
  search: string = '';
  column: string = '';
  sort: boolean | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  isLoading: boolean = false;
  popupVisible: boolean = false;
  id: string | undefined;
  reportsTo: string | null = null;
  date: boolean | null = null;
  selectedTicket: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedData: any = null;
  constructor(
    private appService: AppService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    document.title = 'Tessera - ' + this.title;
    this.id = this.appService.id;
    this.reportsTo = this.appService.reportsTo;
    this.getAllTickets();
    this.appService.newUpdate.subscribe({
      next: (message) => {
        if (location.pathname == '/history') {
          console.log(message);
          if (
            message.get('history') === `${this.selectedData?.id}` &&
            message.get('history') !== false
          ) {
            console.log('updated');
            this.closePopup();
            this.getAllTicketsWithoutLoading();
          } else if (message.get('history') !== false) {
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
      this.historyService
        .getAllTickets(
          this.reportsTo,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.date
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
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.historyService
        .getAllTicketsForTs(
          this.id,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.date
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
      this.historyService
        .getAllTickets(
          this.reportsTo,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.date
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
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.historyService
        .getAllTicketsForTs(
          this.id,
          this.search,
          this.column,
          this.sort,
          this.page,
          this.pageSize,
          this.date
        )
        .subscribe({
          next: (result) => {
            this.data = result.data;
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

  closePopup() {
    this.selectedData = null;
    this.popupVisible = false;
    this.selectedTicket.next(null);
  }

  changeDate($event : any) {
    const value = $event.target.value === "" ? null : $event.target.value ;
    this.date = value;
    this.getAllTicketsWithoutLoading();
  }
}
