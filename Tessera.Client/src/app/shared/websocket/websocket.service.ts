import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AppService } from '../services/AppService/app.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // socket$: WebSocketSubject<any>;
  socket: WebSocket | undefined;
  username: string | undefined;
  reportsTo: string | null = null;
  role: string | undefined;

  constructor() {

  }

  registerWebSocket(username: string | undefined, reportsTo: string | null, role: string | undefined): void {
    this.username = username;
    this.reportsTo = reportsTo;
    this.role = role;
  }

  sendMessage(message: any): void {
    this.socket!.send(JSON.stringify(message));
  }

  closeWebSocket(): void {
    this.socket!.close();
  }

  createWebSocket() {
    this.socket = new WebSocket('wss://localhost:7168');
  }

  // registerUsername(username: string): void {
  //   const registrationMessage = {
  //     type: 'register',
  //     username: username,
  //   };
  //   this.socket$.next(registrationMessage);
  // }

  // sendMessage(message: any): void {
  //   this.socket$.next(message);
  // }

  // receiveMessage(): WebSocketSubject<any> {
  //   return this.socket$;
  // }

  // closeConnection(): void {
  //   this.socket$.complete();
  // }
}
