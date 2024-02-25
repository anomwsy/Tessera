import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { WebsocketService } from '../../websocket/websocket.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  ApiUrl: string = 'https://localhost:7168/api/v1/';
  id: string | undefined;
  username: string | undefined;
  usernameObservable: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);
  roleObservable: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);
  role: string | undefined;
  reportsTo: string | null = null;
  token: string | undefined;
  notification: BehaviorSubject<Map<string, boolean>> = new BehaviorSubject<
    Map<string, boolean>
  >(new Map<string, boolean>());
  newUpdate: BehaviorSubject<Map<string, string | boolean>> =
    new BehaviorSubject<Map<string, string | boolean>>(
      new Map<string, string | boolean>()
    );
  // private subscription: Subscription;
  receivedMessage: any;
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private webSocketService: WebsocketService
  ) {
    const currentMap = this.notification.value;
    const updateMap = this.newUpdate.value;
    currentMap.set('employee', false);
    updateMap.set('employee', false);
    currentMap.set('appeal', false);
    updateMap.set('appeal', false);
    currentMap.set('ticket', false);
    updateMap.set('ticket', false);
    currentMap.set('history', false);
    updateMap.set('history', false);
    this.notification.next(currentMap);
    this.newUpdate.next(updateMap);
    this.parseJwt();
    this.createWS();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const username = this.username;
        if (this.username === undefined || username !== this.username) {
          this.createWS();
        }
      }
    });

    // this.subscription = this.webSocketService.receiveMessage().subscribe(
    //   (message) => {
    //     this.receivedMessage = message;
    //     console.log('Received message:', message);
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
  }
  createWS() {
    // Mendaftarkan kembali pengguna dengan WebSocket
    this.webSocketService.registerWebSocket(
      this.username,
      this.reportsTo,
      this.role
    );

    // Buat objek WebSocket baru
    if (this.webSocketService.socket !== undefined) {
      this.webSocketService.closeWebSocket();
    }
    this.webSocketService.createWebSocket();

    // Event handler saat koneksi terbuka
    this.webSocketService.socket!.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      const registrationData = {
        type: 'register',
        username: this.username ?? '',
        id: this.id ?? '',
        role: this.role ?? '',
        reportsTo: this.reportsTo ?? '',
      };
      this.webSocketService.socket!.send(JSON.stringify(registrationData));
      // Tambahkan logika atau tindakan lain yang diperlukan saat koneksi terbuka
    };

    // Event handler saat menerima pesan dari server
    this.webSocketService.socket!.onmessage = (event) => {
      const result = JSON.parse(event.data);
      const updateMap = this.newUpdate.value;
      const currentMap = this.notification.value;
      if (result.type === 'newAppeal') {
        currentMap.set('appeal', true);
        updateMap.set('appeal', result.message);
      } else if (result.type === 'newEmployee') {
        currentMap.set('employee', true);
        updateMap.set('employee', result.message);
      } else if (result.type === 'newTicket') {
        currentMap.set('ticket', true);
        updateMap.set('ticket', result.message);
      } else if (result.type === 'newHistory') {
        currentMap.set('history', true);
        updateMap.set('history', result.message);
      } else if (result.type === 'appeal') {
        updateMap.set('appeal', result.message);
      } else if (result.type === 'employee') {
        updateMap.set('employee', result.message);
      } else if (result.type === 'ticket') {
        updateMap.set('ticket', result.message);
      } else if (result.type === 'history') {
        updateMap.set('history', result.message);
      }

      this.notification.next(currentMap);
      this.newUpdate.next(updateMap);
      // Tambahkan logika atau tindakan lain untuk menanggapi pesan dari server
    };

    // Event handler saat terjadi kesalahan pada koneksi
    this.webSocketService.socket!.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Tambahkan logika atau tindakan lain untuk menanggapi kesalahan koneksi
    };

    // Event handler saat koneksi ditutup
    this.webSocketService.socket!.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      // Tambahkan logika atau tindakan lain saat koneksi ditutup
    };
  }
  parseJwt() {
    const token = this.cookieService.get('authToken');
    if (!token) {
      this.usernameObservable.next(undefined);
      this.roleObservable.next(undefined);
      this.username = undefined;
      this.role = undefined;
      this.reportsTo = null;
      return;
    }
    this.token = token;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    this.id = decodedToken['Id'];
    this.username =
      decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    this.role =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    this.reportsTo = decodedToken['ReportsTo'];
    this.usernameObservable.next(this.username);
    this.roleObservable.next(this.role);
  }
  resetInformationAccount() {
    this.usernameObservable.next(undefined);
    this.roleObservable.next(undefined);
    this.token = undefined;
    this.id = undefined;
    this.username = undefined;
    this.role = undefined;
    this.reportsTo = null;
  }

  // ngOnDestroy(): void {
  //   // Unsubscribe untuk menghindari kebocoran memori
  //   this.subscription.unsubscribe();
  // }

  resetNotification(menu: string) {
    const currentMap = this.notification.value;
    const updateMap = this.newUpdate.value;
    if (currentMap.get(menu)) {
      currentMap.set(menu, false);
      updateMap.set(menu, false);
    }
    this.notification.next(currentMap);
    this.newUpdate.next(updateMap);
  }
}
