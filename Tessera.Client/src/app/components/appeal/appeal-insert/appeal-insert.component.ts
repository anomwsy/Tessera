import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppealService } from '../AppealService/appeal.service';
import { AppService } from '../../../shared/services/AppService/app.service';
import { WebsocketService } from '../../../shared/websocket/websocket.service';

@Component({
  selector: 'app-appeal-insert',
  templateUrl: './appeal-insert.component.html',
  styleUrl: './appeal-insert.component.scss',
})
export class AppealInsertComponent implements OnInit {
  appealForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private appealService: AppealService,
    private cookieService: CookieService,
    private appService: AppService,
    private webSocketService: WebsocketService
  ) {
    this.appealForm = this.createForm();
  }

  ngOnInit(): void {
    // this.webSocketService.receiveMessage().subscribe(
    //   (message) => {
    //     console.log(message);
    //   }
    // );
  }

  createForm() {
    return this.formBuilder.group({
      subject: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  onInputChange() {
    // Sembunyikan pesan kesalahan saat nilai input berubah
    if (this.errorMessage && this.errorMessage !== '') {
      this.errorMessage = null;
    }
  }

  onSubmit() {
    this.appealForm.markAllAsTouched();
    if (this.appealForm.valid) {
      const value = this.appealForm.getRawValue();
      this.appealService.InsertAppeal(value).subscribe({
        next: (result) => {
          this.sendMessage('newAppeal','');
          this.appealForm.reset();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  sendMessage(type : string, message: string): void {
    const messageData = {
      type: type,
      sender: this.appService.username,
      message: message,
      recipientType: 'Role',
      recipient: '',
    };
    this.webSocketService.sendMessage(messageData);
  }
}
