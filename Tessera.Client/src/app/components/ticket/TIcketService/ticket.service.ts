import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../shared/services/AppService/app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

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
    workStatus: string | null
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
      'Ticket?' +
      (reportsTo ? 'reportsTo=' + reportsTo + '&' : '') +
      (search ? 'search=' + search + '&' : '') +
      (column ? 'column=' + column + '&' : '') +
      (sort === true || sort === false ? 'sort=' + sort + '&' : '') +
      'page=' +
      page +
      '&pageSize=' +
      pageSize +
      '&workStatus=' + workStatus
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
    workStatus: string | null
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
      'Ticket/TS?' +
      (id ? 'id=' + id + '&' : '') +
      (search ? 'search=' + search + '&' : '') +
      (column ? 'column=' + column + '&' : '') +
      (sort === true || sort === false ? 'sort=' + sort + '&' : '') +
      'page=' +
      page +
      '&pageSize=' +
      pageSize +
      '&workStatus=' + workStatus
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

  createSolution(solution: any): Observable<any> {
    return this.httpClient.post(
      this.appService.ApiUrl +
      'TicketSolution',
      solution,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.appService.token
        }
      }
    )
  }

  reviewSolution(solution: any): Observable<any> {
    return this.httpClient.put(
      this.appService.ApiUrl +
      'TicketSolution',
      solution,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.appService.token
        }
      }
    )
  }
}
