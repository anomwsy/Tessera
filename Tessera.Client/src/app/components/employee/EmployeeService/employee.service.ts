import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../shared/services/AppService/app.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmployeeService {
  search: string = '';
  column: string = '';
  sort: boolean | null = null;
  page: number = 1;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {
  }

  getAllEmployee(
    search: string,
    column: string,
    sort: boolean | null,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
        'Employee?' +
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

  getEmployeeByID(id: string | null): Observable<any> {
    return this.httpClient.get(this.appService.ApiUrl + 'Employee/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  updateEmployee(data: any): Observable<any> {
    return this.httpClient.put(this.appService.ApiUrl + 'Employee', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  getDropDown(): Observable<any> {
    return this.httpClient.get(this.appService.ApiUrl + 'Employee/DropDown', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  addEmployee(data: any): Observable<any> {
    return this.httpClient.post(this.appService.ApiUrl + 'Employee', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  getAllTechSupport(
    reportsTo: string | null,
    search: string,
    column: string,
    sort: boolean | null,
    page: number,
    pageSize: number,
    duty: boolean | null
  ): Observable<any> {
    return this.httpClient.get(
      this.appService.ApiUrl +
        'Employee/TechSupport?' +
        (reportsTo ? 'reportsTo=' + reportsTo + '&' : '') +
        (search ? 'search=' + search + '&' : '') +
        (column ? 'column=' + column + '&' : '') +
        (sort === true || sort === false ? 'sort=' + sort + '&' : '') +
        'page=' +
        page +
        '&pageSize=' +
        pageSize +
        (duty === true || duty === false ? '&duty=' + duty : '')
    , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.httpClient.delete(this.appService.ApiUrl + 'Employee/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.appService.token
      },
    });
  }
}
