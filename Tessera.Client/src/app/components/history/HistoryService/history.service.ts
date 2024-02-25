import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../shared/services/AppService/app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) { }

  getAllTickets(
    reportsTo: string | null,
    search: string,
    column: string,
    sort: boolean | null,
    page: number,
    pageSize: number,
    date: boolean | null
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
      'TicketSolution?' +
      (reportsTo ? 'reportsTo=' + reportsTo + '&' : '') +
      (search ? 'search=' + search + '&' : '') +
      (column ? 'column=' + column + '&' : '') +
      (sort === true || sort === false ? 'sort=' + sort + '&' : '') +
      'page=' +
      page +
      '&pageSize=' +
      pageSize +
      (date === null ? '' : '&date=' + date)
    , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  getAllTicketsForTs(
    id: string | undefined,
    search: string,
    column: string,
    sort: boolean | null,
    page: number,
    pageSize: number,
    date: boolean | null
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
      'TicketSolution/TS?' +
      (id ? 'id=' + id + '&' : '') +
      (search ? 'search=' + search + '&' : '') +
      (column ? 'column=' + column + '&' : '') +
      (sort === true || sort === false ? 'sort=' + sort + '&' : '') +
      'page=' +
      page +
      '&pageSize=' +
      pageSize +
      (date === null ? '' : '&date=' + date)
    , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  getDetailTicket(id: string | undefined): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
      'Ticket/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.appService.token
        }
      }
    )
  }
}
