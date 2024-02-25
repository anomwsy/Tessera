import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../shared/services/AppService/app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppealService {

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) { }
  getAllAppeals(
    reportsTo: string | null,
    search: string,
    column: string,
    sort: boolean | null,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
        'Appeal?' +
        (reportsTo ? 'reportsTo=' + reportsTo + '&' : '') +
        (search ? 'search=' + search + '&' : '') +
        (column ? 'column=' + column + '&' : '') +
        (sort === true || sort === false ? 'sort=' + sort + '&' : '') +
        'page=' +
        page +
        '&pageSize=' +
        pageSize
    , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  InsertAppeal(data: any): Observable<any> {
    return this.httpClient.post(this.appService.ApiUrl + 'Appeal', data, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  GetAppeal(id: any): Observable<any> {
    return this.httpClient.get(this.appService.ApiUrl + 'Appeal/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    })
  }

  rejectAppeal(id: any): Observable<any> {
    return this.httpClient.delete(this.appService.ApiUrl + 'Appeal/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    })
  }

  getTechSupport(): Observable<any> {
    return this.httpClient.get(this.appService.ApiUrl + 'Ticket/' + this.appService.reportsTo, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    })
  }
  createTicket(data: any): Observable<any> {
    return this.httpClient.post(this.appService.ApiUrl + 'Ticket', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      }
    })
  }
}
