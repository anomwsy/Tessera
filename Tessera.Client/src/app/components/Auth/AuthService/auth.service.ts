import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../shared/services/AppService/app.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  path = 'Auth';
  private _httpClient: HttpClient;
  private _appService: AppService;
  constructor(httpClient: HttpClient ,activatedRoute: ActivatedRoute, router: Router, appService:AppService) {
    this._httpClient = httpClient
    this._appService = appService
  }

  Login(username: string, password: string) : Observable<any> {
     return this._httpClient.post(this._appService.ApiUrl + this.path, {username: username, password: password},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }
}
